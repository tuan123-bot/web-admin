// components/ConfirmationModal.jsx
import React from "react";
import { formStyles, styles } from "../utils/constants";

const ConfirmationModal = ({ isOpen, product, onClose, onConfirm }) => {
  if (!isOpen || !product) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#DC2626",
            marginBottom: "16px",
            borderBottom: "1px solid #FEE2E2",
            paddingBottom: "8px",
          }}
        >
          Xác nhận Xóa Sản phẩm
        </h3>
        <p
          style={{
            color: "#4B5563",
            marginBottom: "24px",
            lineHeight: "1.6",
          }}
        >
          Bạn có chắc chắn muốn{" "}
          <span style={{ fontWeight: "700", color: "#B91C1C" }}>
            xóa vĩnh viễn
          </span>{" "}
          sản phẩm <strong style={{ fontWeight: "800" }}>{product.name}</strong>{" "}
          (Giá:
          <span style={{ fontFamily: "monospace" }}>
            {" "}
            {product.price ? product.price.toLocaleString("vi-VN") : "N/A"} VND
          </span>
          ) không? Hành động này không thể hoàn tác.
        </p>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          <button onClick={onClose} style={formStyles.cancelButton}>
            Hủy
          </button>
          <button
            onClick={() => onConfirm(product._id)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#DC2626",
              color: "white",
              borderRadius: "12px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(239, 68, 68, 0.5)",
              transition: "background-color 0.2s",
            }}
          >
            Xóa Vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
