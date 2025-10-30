import React, { useState } from "react";
import { formStyles, styles } from "../utils/constants";

const AddProductFormModal = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    thumbnail: "", // 🚨 ĐÃ THÊM: Trường thumbnail cho URL hình ảnh
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const value =
      fieldName === "price"
        ? e.target.value.replace(/[^0-9.]/g, "")
        : e.target.value;

    setFormData({ ...formData, [fieldName]: value });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const priceValue = parseFloat(formData.price);

    if (
      !formData.title ||
      !formData.description ||
      isNaN(priceValue) ||
      priceValue <= 0 ||
      !formData.thumbnail // 🚨 ĐÃ THÊM: Kiểm tra thumbnail cũng là bắt buộc
    ) {
      setFormError(
        "Vui lòng nhập đầy đủ Tên, Mô tả, Giá (> 0) và URL Hình ảnh."
      );
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      await onAddProduct({ ...formData, price: priceValue });

      // Reset form
      setFormData({ title: "", price: "", description: "", thumbnail: "" });
      onClose();
    } catch (error) {
      setFormError(error.message || "Lỗi không xác định khi thêm sản phẩm.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={formStyles.modalContentAdd}>
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#10B981", // Emerald-500
            marginBottom: "24px",
            borderBottom: "1px solid #D1FAE5",
            paddingBottom: "8px",
          }}
        >
          ➕ Thêm Sản Phẩm Mới
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Tên Sản Phẩm */}
          <div style={{ marginBottom: "16px" }}>
            <label style={formStyles.label} htmlFor="title">
              Tên Sản Phẩm:
            </label>
            <input
              style={formStyles.input}
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ví dụ: Laptop Gaming X1"
              disabled={submitting}
            />
          </div>

          {/* Giá (Price) */}
          <div style={{ marginBottom: "16px" }}>
            <label style={formStyles.label} htmlFor="price">
              Giá (VND):
            </label>
            <input
              style={formStyles.input}
              type="text"
              pattern="[0-9]*"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ví dụ: 25000000"
              disabled={submitting}
            />
          </div>

          {/* URL Hình ảnh (Thumbnail) */}
          <div style={{ marginBottom: "16px" }}>
            <label style={formStyles.label} htmlFor="thumbnail">
              URL Hình ảnh:
            </label>
            <input
              style={formStyles.input}
              type="text" // Hoặc 'url' nếu bạn muốn trình duyệt tự validate một chút
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Ví dụ: https://example.com/images/laptop.jpg"
              disabled={submitting}
            />
          </div>

          {/* Mô tả (Description) */}
          <div style={{ marginBottom: "24px" }}>
            <label style={formStyles.label} htmlFor="description">
              Mô tả ngắn:
            </label>
            <textarea
              style={{
                ...formStyles.input,
                height: "80px",
                resize: "vertical",
              }}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về sản phẩm..."
              disabled={submitting}
            />
          </div>

          {/* Error Message */}
          {formError && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                color: "#B91C1C",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "24px",
                fontSize: "14px",
                border: "1px solid #FCA5A5",
              }}
            >
              {formError}
            </div>
          )}

          {/* Buttons */}
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
          >
            <button
              type="button"
              onClick={onClose}
              style={formStyles.cancelButton}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                ...formStyles.submitButton,
                cursor: submitting ? "progress" : "pointer",
                opacity: submitting ? 0.8 : 1,
              }}
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Thêm Sản Phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductFormModal;
