// components/ProductRow.jsx
import React, { useState } from "react";
import { styles } from "../utils/constants";

const ProductRow = ({ product, handleOpenDeleteModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Định dạng giá tiền
  const formattedPrice = product.price
    ? `${parseFloat(product.price).toLocaleString("vi-VN", {
        maximumFractionDigits: 0,
      })} VND`
    : "N/A";

  return (
    <tr
      key={product._id}
      style={{ ...styles.tr, ...(isHovered ? styles.trHover : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td style={{ ...styles.td, fontWeight: "500", color: "#4B5563" }}>
        {product._id ? `${product._id.substring(0, 8)}...` : "N/A"}
      </td>
      <td
        style={{
          ...styles.td,
          fontWeight: "600",
          fontSize: "16px",
          color: "#1F2937",
        }}
      >
        {/* ✅ SỬA LỖI: Sử dụng product.title thay vì product.name */}
        {product.title || "Chưa cập nhật"}
      </td>
      <td style={{ ...styles.td, color: "#10B981", fontWeight: "700" }}>
        {formattedPrice}
      </td>
      <td
        style={{
          ...styles.td,
          color: "#6B7280",
          maxWidth: "250px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {product.description || "N/A"}
      </td>
      <td style={{ ...styles.td, textAlign: "right" }}>
        <button
          onClick={() => handleOpenDeleteModal(product)}
          style={{
            ...styles.deleteButton,
          }}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
