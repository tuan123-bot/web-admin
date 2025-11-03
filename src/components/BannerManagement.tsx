// components/BannerManagement.tsx (Tạo file này)

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BannerFormModal from "./BannerFormModal";

// Giao diện Banner (phải đồng bộ với Model Banner.js)
interface Banner {
  _id: string;
  image: string;
  link: string;
  position: number;
  isActive: boolean;
}

const BANNER_API_URL = "http://localhost:5000/api/banners";
const BASE_URL = "http://localhost:5000";

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State cho Form/Modal (Giả định bạn có modal/form riêng)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // --- Hàm Tải Banner ---
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      // 🎯 FIX: KHAI BÁO KIỂU DỮ LIỆU TRẢ VỀ RÕ RÀNG TRONG AXIOS GET
      const response = await axios.get<Banner[]>(BANNER_API_URL);

      // 🎯 FIX: Kiểm tra an toàn trước khi set (vì Backend có thể trả về object lỗi)
      if (Array.isArray(response.data)) {
        setBanners(response.data);
        setError("");
      } else {
        // Trường hợp API không trả về mảng trực tiếp
        setBanners([]);
        console.warn("API Banner trả về dữ liệu không phải mảng.");
      }
    } catch (err) {
      console.error("Lỗi tải banner:", err);
      setError("Không thể tải banner. Kiểm tra API Backend.");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // --- Hàm Xóa Banner ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa banner này không?")) return;
    try {
      await axios.delete(`${BANNER_API_URL}/${id}`);
      alert("Xóa banner thành công!");
      fetchBanners();
    } catch (err) {
      alert("Lỗi khi xóa banner.");
    }
  };

  // --- Logic Render ---
  if (loading) return <div>Đang tải danh sách banner...</div>;
  if (error)
    return <div style={{ color: "red", padding: "20px" }}>Lỗi: {error}</div>;

  return (
    <div className="banner-management">
      <h2>🖼️ Quản lý Banner Trượt</h2>

      {/* Nút thêm banner mới */}
      <button
        onClick={() => {
          setEditingBanner(null);
          setIsFormOpen(true);
        }}
        style={{ marginBottom: "15px", padding: "10px 15px" }}
      >
        + Thêm Banner Mới
      </button>

      {/* Bảng danh sách banner */}
      {banners.length === 0 ? (
        <p>Chưa có banner nào.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Link</th>
              <th>Vị trí</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td>
                  <img
                    src={`${BASE_URL}${banner.image}`}
                    alt="Banner"
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td>{banner.link}</td>
                <td>{banner.position}</td>
                <td>
                  <span style={{ color: banner.isActive ? "green" : "red" }}>
                    {banner.isActive ? "Kích hoạt" : "Ẩn"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setEditingBanner(banner);
                      setIsFormOpen(true);
                    }}
                    style={{ marginRight: "10px" }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal thêm/sửa banner */}
      {isFormOpen && (
        <BannerFormModal
          onClose={() => setIsFormOpen(false)}
          onSuccess={fetchBanners}
          bannerToEdit={editingBanner}
        />
      )}
    </div>
  );
};
export default BannerManagement;
