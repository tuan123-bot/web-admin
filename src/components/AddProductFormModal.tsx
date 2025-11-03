import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Modal.css";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  description: string;
}

interface AddProductModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void>;
  productToEdit: Product | null;
}

const AddProductFormModal: React.FC<AddProductModalProps> = ({
  onClose,
  onSuccess,
  productToEdit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    stock: 0,
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = "http://localhost:5000/api/products";
  const isEditing = !!productToEdit;

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || "",
        price: productToEdit.price || 0,
        stock: productToEdit.stock || 0,
        description: productToEdit.description || "",
      });
      setSelectedFile(null);
    }
  }, [productToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedFile(e.target.files?.[0] || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price.toString());
    data.append("stock", formData.stock.toString());
    data.append("description", formData.description);
    if (selectedFile) data.append("image", selectedFile);
    else if (!isEditing) {
      alert("Vui lòng chọn ảnh sản phẩm.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing)
        await axios.put(`${API_BASE_URL}/${productToEdit!._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      else
        await axios.post(API_BASE_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

      alert(
        isEditing
          ? "Cập nhật sản phẩm thành công!"
          : "Thêm sản phẩm thành công!"
      );
      await onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Lỗi API:", err.response?.data?.message || err.message);
      alert(
        `Thao tác thất bại: ${
          err.response?.data?.message || "Lỗi kết nối Server"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isEditing ? "✏️ Chỉnh sửa Sản phẩm" : "+ Thêm Sản phẩm Mới"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Tên Sản phẩm:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Ảnh Sản phẩm:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            required={!isEditing}
          />
          {isEditing && !selectedFile && (
            <small style={{ color: "gray" }}>
              *Để trống nếu không muốn đổi ảnh.
            </small>
          )}
          {selectedFile && (
            <p style={{ color: "green" }}>Đã chọn: {selectedFile.name}</p>
          )}

          <label>Giá:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
          />

          <label>Số lượng trong kho:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
          />

          <label>Mô tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Đang xử lý..."
                : isEditing
                ? "Lưu thay đổi"
                : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductFormModal;
