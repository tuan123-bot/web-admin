// components/BannerFormModal.tsx (Khung sườn form)

import React, { useState } from "react";
import axios from "axios";
import "../css/Modal.css"; // Đảm bảo đường dẫn CSS đúng

interface Banner {
  _id: string;
  image: string;
  link: string;
  position: number;
  isActive: boolean;
}

interface BannerFormProps {
  onClose: () => void;
  onSuccess: () => Promise<void>;
  bannerToEdit: Banner | null; // null nếu là thêm mới
}

const BANNER_API_URL = "http://localhost:5000/api/banners";

const BannerFormModal: React.FC<BannerFormProps> = ({
  onClose,
  onSuccess,
  bannerToEdit,
}) => {
  // Logic form, state, và handleSubmit (Tương tự AddProductFormModal)
  const [link, setLink] = useState(bannerToEdit?.link || "");
  const [position, setPosition] = useState(bannerToEdit?.position || 0);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!bannerToEdit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("link", link);
    data.append("position", position.toString());

    // Chỉ thêm file nếu có chọn hoặc là chế độ thêm mới
    if (file) {
      data.append("bannerImage", file);
    } else if (!isEditing) {
      alert("Vui lòng chọn ảnh banner.");
      setIsSubmitting(false);
      return;
    }
    try {
      const endpoint = isEditing
        ? `${BANNER_API_URL}/${bannerToEdit._id}`
        : BANNER_API_URL;

      await axios({
        method: isEditing ? "put" : "post",
        url: endpoint,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`${isEditing ? "Cập nhật" : "Thêm mới"} banner thành công!`);
      await onSuccess();
      onClose();
    } catch (err: any) {
      alert(
        `Thao tác thất bại: ${err.response?.data?.message || "Lỗi server"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isEditing ? "✏️ Sửa Banner" : "+ Thêm Banner"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Liên kết (Link):</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />

          <label>Vị trí ưu tiên:</label>
          <input
            type="number"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            required
            min="0"
          />

          <label>Chọn Ảnh Banner:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            required={!isEditing}
          />

          {file && (
            <p style={{ fontSize: "0.9em", color: "green" }}>
              Đã chọn: {file.name}
            </p>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerFormModal;
