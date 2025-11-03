import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductRow from "./ProductRow";
import AddProductFormModal from "./AddProductFormModal";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  description: string;
  thumbnail?: string;
  image?: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const API_BASE_URL = "http://localhost:5000/api/products";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<Product[]>(API_BASE_URL);
      setProducts(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err: any) {
      console.error(
        "Lỗi khi tải sản phẩm:",
        err.response?.data?.message || err.message
      );
      setError("Không thể tải danh sách sản phẩm. Kiểm tra Server Backend.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        setProducts((prev) => prev.filter((p) => p._id !== id));
        alert("Sản phẩm đã được xóa thành công!");
      } catch {
        alert("Lỗi khi xóa sản phẩm.");
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error)
    return <div style={{ color: "red", padding: "20px" }}>Lỗi: {error}</div>;

  return (
    <div className="product-management">
      <h2>💻 Quản lý Sản phẩm</h2>
      <button
        onClick={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
      >
        + Thêm Sản phẩm Mới
      </button>

      {products.length === 0 ? (
        <p>Chưa có sản phẩm nào được tạo.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên Sản phẩm</th>
              <th>Giá</th>
              <th>Kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                onDelete={handleDeleteProduct}
                onEdit={handleEditProduct}
              />
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <AddProductFormModal
          onClose={handleCloseModal}
          onSuccess={fetchProducts}
          productToEdit={editingProduct}
        />
      )}
    </div>
  );
};

export default ProductManagement;
