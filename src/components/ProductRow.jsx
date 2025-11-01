// components/ProductRow.jsx
import React, { useState } from "react";
// Đảm bảo bạn có file constants.js chứa các đối tượng styles
import { styles } from "../utils/constants";

const ProductRow = ({ product, handleOpenDeleteModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Định dạng giá tiền (Giữ nguyên, chỉ đảm bảo price cũng được ép kiểu an toàn)
  const priceValue = Number(product.price) || 0; // Ép kiểu giá tiền
  const formattedPrice = priceValue
    ? `${priceValue.toLocaleString("vi-VN", {
        maximumFractionDigits: 0,
      })} VND`
    : "N/A";

  // ✅ SỬA LỖI: Ép kiểu dữ liệu tồn kho về number
  const stockValue = Number(product.stock) || Number(product.quantity) || 0;

  return (
    <tr
      key={product._id}
      style={{ ...styles.tr, ...(isHovered ? styles.trHover : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. ID Sản phẩm */}
      <td style={{ ...styles.td, fontWeight: "500", color: "#4B5563" }}>
        {product._id ? `${product._id.substring(0, 8)}...` : "N/A"}
      </td>

      {/* 2. Tên sản phẩm */}
      <td
        style={{
          ...styles.td,
          fontWeight: "600",
          fontSize: "16px",
          color: "#1F2937",
        }}
      >
        {product.title || product.name || "Chưa cập nhật"}
      </td>

      {/* 3. Giá */}
      <td style={{ ...styles.td, color: "#10B981", fontWeight: "700" }}>
        {formattedPrice}
      </td>

      {/* 4. Tồn kho (Hiển thị stockValue đã được ép kiểu) */}
      <td
        style={{
          ...styles.td,
          fontWeight: "500",
          color: stockValue > 0 ? "#1F2937" : "#EF4444",
        }}
      >
        {stockValue}
      </td>

      {/* 5. Hình ảnh */}
      <td style={styles.td}>
        <img
          src={product.thumbnail || product.image || "placeholder.jpg"}
          alt={product.title || product.name || "Product Image"}
          style={{ width: 55, height: 55, borderRadius: 8, objectFit: "cover" }}
        />
      </td>

      {/* 6. Mô tả */}
      <td
        style={{
          ...styles.td,
          color: "#6B7280",
          maxWidth: "250px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {product.description?.length > 70
          ? `${product.description.slice(0, 70)}...`
          : product.description || "N/A"}
      </td>

      {/* 7. Hành động */}
      <td style={{ ...styles.td, textAlign: "center" }}>
        <button
          onClick={() => handleOpenDeleteModal(product)}
          style={styles.deleteButton}
        >
          🗑️ Xóa
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
