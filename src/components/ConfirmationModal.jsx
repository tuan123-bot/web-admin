// components/ConfirmationModal.jsx

import React from "react";
import "../css/Modal.css"; // Sửa lại đường dẫn nếu cần

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-modal">
        <h3>{title || "Xác nhận hành động"}</h3>
        <p>{message || "Bạn có chắc chắn muốn thực hiện hành động này?"}</p>

        <div className="modal-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-confirm"
            style={{ backgroundColor: "#e74c3c", color: "white" }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
