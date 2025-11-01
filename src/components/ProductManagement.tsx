import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Alert,
  Spin,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./ProductManagement.css";

// Giả định URL backend
const API_URL = "http://localhost:5000/api/products";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  description: string;
  thumbnail: string; // URL hình ảnh
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // --- 🎯 HÀM GỌI API LẤY DANH SÁCH SẢN PHẨM (ĐÃ THÊM LOGIC ÉP KIỂU) ---
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Lỗi khi tải sản phẩm.");
      }
      const data = await response.json();

      const rawProducts = data.products || data;

      const processedProducts = rawProducts.map((p: any) => ({
        ...p,
        // ✅ Đảm bảo price và stock luôn là số (0 nếu parse thất bại)
        price: p.price ? Number(p.price) : 0,
        stock: p.stock ? Number(p.stock) : 0,
        key: p._id,
      }));

      setProducts(processedProducts);
    } catch (err: any) {
      console.error(err);
      setError("Không thể tải sản phẩm. Vui lòng kiểm tra API Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 🎯 HÀM XỬ LÝ THÊM / CẬP NHẬT SẢN PHẨM (ĐÃ THÊM LOGIC ÉP KIỂU TRƯỚC KHI GỬI) ---
  const handleFormSubmit = async (values: Product) => {
    setLoading(true);
    try {
      const url = isEditMode ? `${API_URL}/${currentProduct?._id}` : API_URL;
      const method = isEditMode ? "PUT" : "POST";

      // ✅ Ép kiểu giá trị thành số nguyên/số thực trước khi gửi
      const payload = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      };

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Thao tác ${isEditMode ? "cập nhật" : "thêm"} thất bại.`
        );
      }

      await fetchProducts();
      setIsModalVisible(false);
      setCurrentProduct(null);
      form.resetFields();
    } catch (err: any) {
      Modal.error({ title: "Lỗi", content: err.message });
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XÓA SẢN PHẨM (Giữ nguyên) ---
  const handleDeleteProduct = (productId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Xóa sản phẩm thất bại.");
          }
          await fetchProducts();
        } catch (err: any) {
          Modal.error({ title: "Lỗi", content: err.message });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // --- CỘT CHO BẢNG SẢN PHẨM (Giữ nguyên) ---
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (url: string) => (
        <img
          src={url}
          alt="SP"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Tên SP",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <strong style={{ color: "#1890ff" }}>{text}</strong>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) =>
        price ? `${price.toLocaleString("vi-VN")} VND` : "0 VND", // Thêm kiểm tra null/undefined
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>
          {stock}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (text ? text.substring(0, 50) + "..." : "N/A"), // Thêm kiểm tra null/undefined
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_: any, record: Product) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setCurrentProduct(record);
              setIsEditMode(true);
              // form.setFieldsValue(record) sẽ hoạt động tốt vì chúng ta đã ép kiểu Number trong fetchProducts
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDeleteProduct(record._id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: 20 }}>📦 Quản Lý Sản Phẩm</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => {
          setIsEditMode(false);
          setCurrentProduct(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
      >
        Thêm Sản Phẩm
      </Button>

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      {/* Modal Thêm/Sửa Sản phẩm */}
      <Modal
        title={isEditMode ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText={isEditMode ? "Lưu thay đổi" : "Thêm"}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={currentProduct || {}}
        >
          <Form.Item
            name="title"
            label="Tên Sản Phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá (VND)"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            {/* InputNumber không cần formatter rườm rà nếu giá trị đầu vào đã là số */}
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Tồn kho"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="thumbnail"
            label="URL Hình ảnh"
            rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
