import React, { useState } from "react";
import { formStyles } from "../utils/constants";

const AddProductFormModal = ({ isOpen, onClose, onAddProduct, isAdding }) => {
  const [productData, setProductData] = useState({
    title: "",
    price: "",
    stock: "",
    thumbnail: "",
    description: "",
  });

  if (!isOpen) {
    return null; // Không render gì nếu modal không mở
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productData.title || !productData.price || !productData.thumbnail) {
      alert("Vui lòng điền đủ Tên, Giá và URL Hình ảnh.");
      return;
    }
    onAddProduct(productData);
    // Reset form sau khi thêm thành công (được gọi từ Dashboard)
    // Hoặc bạn có thể reset ở đây: setProductData({ ... });
  };

  // --- Styles cho Modal (Để đảm bảo modal hiển thị) ---
  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "10px",
      width: "90%",
      maxWidth: "500px",
      position: "relative",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "none",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
      color: "#999",
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={modalStyles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h3 style={{ marginBottom: "20px" }}>Thêm Sản phẩm Mới</h3>
        <form onSubmit={handleSubmit}>
          {/* Tên sản phẩm */}
          <label style={formStyles.label}>Tên sản phẩm:</label>
          <input
            style={formStyles.input}
            type="text"
            name="title"
            value={productData.title}
            onChange={handleChange}
            placeholder="Tên sản phẩm..."
            disabled={isAdding}
          />

          {/* Giá */}
          <label style={formStyles.label}>Giá (VND):</label>
          <input
            style={formStyles.input}
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            placeholder="Ví dụ: 500000"
            min="0"
            disabled={isAdding}
          />

          {/* Tồn kho */}
          <label style={formStyles.label}>Tồn kho:</label>
          <input
            style={formStyles.input}
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            placeholder="Số lượng tồn kho"
            min="0"
            disabled={isAdding}
          />

          {/* Hình ảnh (URL) */}
          <label style={formStyles.label}>URL Hình ảnh:</label>
          <input
            style={formStyles.input}
            type="text"
            name="thumbnail"
            value={productData.thumbnail}
            onChange={handleChange}
            placeholder="http://..."
            disabled={isAdding}
          />

          {/* Mô tả */}
          <label style={formStyles.label}>Mô tả:</label>
          <textarea
            style={{ ...formStyles.input, height: "80px" }}
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Mô tả sản phẩm..."
            disabled={isAdding}
          ></textarea>

          <button
            type="submit"
            style={formStyles.submitButton}
            disabled={isAdding}
          >
            {isAdding ? "Đang thêm..." : "Thêm Sản phẩm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductFormModal;
