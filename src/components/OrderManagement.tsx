import React, { useState, useEffect } from "react";

// Giả định Ant Design đã được cài đặt. Nếu không, thay thế bằng HTML cơ bản.
import { Table, Tag, Button, Alert, Spin, Descriptions, Modal } from "antd";
import "./OrderManagement.css"; // Tùy chọn: tạo file CSS nếu cần

// Định nghĩa URL Backend của bạn
// VÍ DỤ: Cần thay thế bằng địa chỉ server thực tế của bạn
const API_URL = "http://localhost:5000/api/orders";

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ĐƠN HÀNG ---
interface Order {
  _id: string; // ID đơn hàng
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  paymentMethod: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Cancelled";
  timestamp: string;
  items: { title: string; price: number }[];
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 🎯 1. HÀM GỌI API LẤY DANH SÁCH ĐƠN HÀNG
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi tải đơn hàng.");
      }
      const data = await response.json();

      // ✅ Giả định server trả về mảng đơn hàng TRỰC TIẾP
      // Nếu server trả về { data: [...] }, bạn dùng: setOrders(data.data);
      // Chúng ta cần thêm trường 'key' cho Ant Design Table (nếu cần)
      const processedOrders = (data.orders || data).map((order: Order) => ({
        ...order,
        key: order._id,
      }));

      setOrders(processedOrders);
    } catch (err: any) {
      console.error(err);
      setError("Không thể tải đơn hàng. Vui lòng kiểm tra API Server.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 2. HÀM CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Cập nhật thất bại. Server không phản hồi OK.");
      }

      // Cập nhật thành công, tải lại danh sách đơn hàng
      fetchOrders();
    } catch (err: any) {
      alert("Lỗi cập nhật trạng thái: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Hàm hiển thị chi tiết đơn hàng
  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  // --- CỘT CHO BẢNG DANH SÁCH ĐƠN HÀNG ---
  const columns = [
    {
      title: "Mã ĐH",
      dataIndex: "_id",
      key: "_id",
      render: (text: string) => (
        <a
          onClick={() => showOrderDetails(orders.find((o) => o._id === text)!)}
        >
          {text.substring(0, 8)}...
        </a>
      ),
    },
    {
      title: "Khách Hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: Order["status"]) => {
        let color = "gold";
        if (status === "Confirmed") color = "blue";
        if (status === "Shipped") color = "green";
        if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_: any, record: Order) => (
        <div style={{ display: "flex", gap: 5 }}>
          <Button
            type="primary"
            size="small"
            disabled={record.status !== "Pending"}
            onClick={() => updateOrderStatus(record._id, "Confirmed")}
          >
            Xác Nhận
          </Button>
          <Button
            type="default"
            size="small"
            danger
            disabled={
              record.status === "Cancelled" || record.status === "Shipped"
            }
            onClick={() => updateOrderStatus(record._id, "Cancelled")}
          >
            Hủy
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: 20 }}>Quản Lý Đơn Hàng</h2>

      {loading && (
        <Spin
          tip="Đang tải dữ liệu..."
          size="large"
          style={{ display: "block", margin: "20px auto" }}
        />
      )}
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
        dataSource={orders}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      {/* Modal Chi tiết đơn hàng */}
      {selectedOrder && (
        <Modal
          title={`Chi tiết Đơn hàng: ${selectedOrder._id.substring(0, 10)}...`}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Khách hàng">
              {selectedOrder.customerName}
            </Descriptions.Item>
            <Descriptions.Item label="SĐT">
              {selectedOrder.customerPhone}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {selectedOrder.deliveryAddress}
            </Descriptions.Item>
            <Descriptions.Item label="P.Thức TT">
              {selectedOrder.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {selectedOrder.totalAmount.toLocaleString("vi-VN")} VND
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={selectedOrder.status === "Confirmed" ? "blue" : "gold"}
              >
                {selectedOrder.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <h4 style={{ marginTop: 15 }}>Sản phẩm:</h4>
          <Table
            dataSource={selectedOrder.items}
            columns={[
              { title: "Tên SP", dataIndex: "title" },
              {
                title: "Giá",
                dataIndex: "price",
                render: (p: number) => `${p.toLocaleString("vi-VN")} VND`,
              },
            ]}
            pagination={false}
            size="small"
            rowKey="title" // Giả định tên sản phẩm là duy nhất trong đơn hàng
          />
        </Modal>
      )}
    </div>
  );
};

export default OrderManagement;
