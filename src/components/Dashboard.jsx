import React, { useState, useEffect } from "react";
import { API_URL, BASE_URL, styles } from "../utils/constants";
import AddProductFormModal from "./AddProductFormModal";
import ConfirmationModal from "./ConfirmationModal";
import ProductRow from "./ProductRow";

// --- Component Card Tóm tắt (Tổng số Sản Phẩm) ---
const ProductSummaryCard = ({ count, title, iconPath }) => (
  <div
    style={{
      ...styles.summaryCard,
      boxShadow: styles.summaryCard.boxShadow,
      cursor: "default",
    }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={styles.summaryCardIconContainer}>
        <svg
          style={styles.summaryCardIcon}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <div>
        <p style={styles.summaryCardTextSmall}>{title}</p>
        <h2 style={styles.summaryCardTextLarge}>{count}</h2>
      </div>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// --- Giao diện Admin Dashboard (React Component) ---
// ----------------------------------------------------------------------
const Dashboard = () => {
  // States cho Sản phẩm
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // States cho Người dùng (MỚI)
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  // --- Hàm Fetch Dữ liệu Sản phẩm (GET) ---
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        const errorDetail = `Status: ${response.status}. Vui lòng kiểm tra lại URL và route /api/products.`;
        throw new Error(`Lỗi HTTP! ${errorDetail}`);
      }

      const rawData = await response.json(); // Nhận dữ liệu thô

      // Điều chỉnh logic để xử lý cả hai định dạng phản hồi
      const finalData =
        rawData.data && Array.isArray(rawData.data) ? rawData.data : rawData;

      if (Array.isArray(finalData)) {
        setProducts(finalData);
      } else {
        setProducts([]);
        console.warn(
          "API response structure is unexpected: expected array or object with data field, got",
          rawData
        );
        setError(
          "Dữ liệu nhận được không phải là mảng sản phẩm. Backend đang trả về định dạng không mong muốn. (Vui lòng kiểm tra trường 'data' trong phản hồi API)."
        );
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      setError(
        `Không thể kết nối đến máy chủ Backend (${BASE_URL}) hoặc lỗi trong quá trình fetch: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Hàm Fetch Dữ liệu Người dùng (GET) (MỚI) ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);

    try {
      // Giả định API_URL là http://localhost:5000/api/products
      // Chúng ta cần lấy route người dùng: http://localhost:5000/api/users
      const usersApiUrl = `${BASE_URL}/api/users`;
      const response = await fetch(usersApiUrl);

      if (!response.ok) {
        throw new Error(
          `Lỗi HTTP Status: ${response.status}. Không thể lấy danh sách người dùng.`
        );
      }

      const rawData = await response.json();

      // Nếu Backend trả về { status: 'success', data: [...] }
      const finalData =
        rawData.data && Array.isArray(rawData.data) ? rawData.data : rawData;

      if (Array.isArray(finalData)) {
        setUsers(finalData);
      } else {
        setUsers([]);
        setErrorUsers("Dữ liệu người dùng nhận được không phải là mảng.");
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
      setErrorUsers(
        `Lỗi: Không thể kết nối hoặc tải dữ liệu người dùng. ${error.message}`
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  // --- Hàm Thêm Sản Phẩm (POST) ---
  const handleAddProduct = async (newProductData) => {
    setError(null);

    const postUrl = `${API_URL}`;

    try {
      const response = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProductData),
      });

      if (!response.ok) {
        const errorText = `Thêm thất bại! Status: ${response.status}. Vui lòng kiểm tra logs Backend.`;
        throw new Error(errorText);
      }

      await fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      throw new Error(`Lỗi: Không thể thêm sản phẩm. ${error.message}`);
    }
  };

  // --- Hàm Xóa Sản Phẩm (DELETE) ---
  const handleDeleteProduct = async (productId) => {
    setLoading(true);
    setError(null);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);

    const deleteUrl = `${API_URL}/${productId}`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = `Xóa thất bại! Status: ${response.status}. Vui lòng kiểm tra logs Backend.`;
        throw new Error(errorText);
      }
      await fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      setError(`Lỗi: Không thể xóa sản phẩm. ${error.message}.`);
      setLoading(false);
    }
  };

  // --- Logic Modal ---
  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setError(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // useEffect để tải dữ liệu khi component được mount
  useEffect(() => {
    fetchProducts();
    fetchUsers(); // GỌI HÀM LẤY DANH SÁCH NGƯỜI DÙNG
  }, []);

  // Lọc danh sách sản phẩm dựa trên Term tìm kiếm
  const filteredProducts = products.filter(
    (product) =>
      // Kiểm tra tên sản phẩm
      (product.title &&
        product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      // Kiểm tra mô tả
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Lọc danh sách người dùng (chỉ để tìm kiếm)
  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Tổng số sản phẩm và người dùng
  const totalProducts = products.length;
  const totalUsers = users.length;

  return (
    <div style={styles.appContainer} suppressHydrationWarning={true}>
      <header
        style={{ marginBottom: "40px", maxWidth: "1000px", margin: "0 auto" }}
      >
        <h1 style={styles.headerTitle}>ADMIN PLATFORM</h1>
        <p style={styles.headerSubtitle}>
          Chào mừng bạn đến với Dashboard quản trị Sản Phẩm và Người Dùng.
        </p>
      </header>

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* 1. KHỐI TÓM TẮT DỮ LIỆU */}
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          {/* Tóm tắt Sản phẩm */}
          <ProductSummaryCard
            count={totalProducts}
            title="Tổng Số Sản Phẩm"
            iconPath="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 11v10"
          />
          {/* Tóm tắt Người dùng (MỚI) */}
          <ProductSummaryCard
            count={totalUsers}
            title="Tổng Số Người Dùng"
            iconPath="M17 20h-3a2 2 0 01-2-2v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2a2 2 0 01-2 2H3m14 0v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m14 0h6m-3-3v6M4 6a4 4 0 118 0 4 4 0 01-8 0z"
          />
        </div>

        {/* 2. THANH CÔNG CỤ: TÌM KIẾM, TẢI LẠI VÀ THÊM MỚI */}
        <div
          style={{
            ...styles.card,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo Tên hoặc Mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "12px",
                border: "1px solid #D1D5DB",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "300px",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
                transition: "all 0.2s",
              }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              {/* NÚT THÊM SẢN PHẨM MỚI */}
              <button
                onClick={handleOpenAddModal}
                style={styles.addButton}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ height: "20px", width: "20px" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Thêm Sản Phẩm
              </button>

              <button
                onClick={() => {
                  fetchProducts();
                  fetchUsers();
                }} // TẢI LẠI CẢ 2
                style={{
                  backgroundColor: "#4F46E5",
                  color: "white",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(79, 70, 229, 0.5)",
                  transition: "all 0.2s",
                  fontWeight: "600",
                  border: "none",
                  cursor: loading || loadingUsers ? "not-allowed" : "pointer",
                  opacity: loading || loadingUsers ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                }}
                disabled={loading || loadingUsers}
              >
                {loading || loadingUsers ? (
                  <svg
                    className="animate-spin"
                    style={{
                      marginRight: "12px",
                      height: "20px",
                      width: "20px",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <circle
                      style={{ opacity: 0.25 }}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      style={{ opacity: 0.75 }}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    style={{
                      marginRight: "8px",
                      height: "20px",
                      width: "20px",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                {loading || loadingUsers ? "Đang tải..." : "Tải lại dữ liệu"}
              </button>
            </div>
          </div>
        </div>

        {/* --- 3. BẢNG DỮ LIỆU SẢN PHẨM --- */}
        <div style={styles.card}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: "16px",
              borderBottom: "1px solid #E0E7FF",
              paddingBottom: "8px",
            }}
          >
            Danh Sách Sản Phẩm ({filteredProducts.length} / {totalProducts})
          </h2>

          {/* --- Hiển thị Trạng thái/Lỗi Sản phẩm --- */}
          {error ? (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#B91C1C",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
              role="alert"
            >
              <strong style={{ fontWeight: "700" }}>LỖI KẾT NỐI API!</strong>
              <span style={{ marginLeft: "8px" }}>{error}</span>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "4px",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                Vui lòng đảm bảo Backend API đang chạy tại **{BASE_URL}**.
              </p>
            </div>
          ) : filteredProducts.length === 0 && !loading ? (
            <div
              style={{ textAlign: "center", padding: "48px", color: "#9CA3AF" }}
            >
              <svg
                style={{
                  margin: "0 auto",
                  height: "64px",
                  width: "64px",
                  color: "#A5B4FC",
                  opacity: 0.7,
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3
                style={{
                  marginTop: "16px",
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "#111827",
                }}
              >
                {searchTerm
                  ? "Không tìm thấy sản phẩm phù hợp"
                  : "Chưa có sản phẩm nào được đăng ký"}
              </h3>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={{ ...styles.th, borderTopLeftRadius: "8px" }}>
                      ID (Rút gọn)
                    </th>
                    <th style={styles.th}>TÊN SẢN PHẨM</th>
                    <th style={styles.th}>GIÁ (VND)</th>
                    <th style={styles.th}>MÔ TẢ</th>
                    <th
                      style={{
                        ...styles.th,
                        textAlign: "right",
                        borderTopRightRadius: "8px",
                      }}
                    >
                      HÀNH ĐỘNG
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "white" }}>
                  {filteredProducts.map((product, index) => (
                    <ProductRow
                      product={product}
                      key={product._id ? product._id.toString() : index}
                      handleOpenDeleteModal={handleOpenDeleteModal}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- 4. BẢNG DỮ LIỆU NGƯỜI DÙNG (MỚI) --- */}
        <div style={styles.card}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: "16px",
              borderBottom: "1px solid #E0E7FF",
              paddingBottom: "8px",
            }}
          >
            Danh Sách Người Dùng ({filteredUsers.length} / {totalUsers})
          </h2>

          {/* --- Hiển thị Trạng thái/Lỗi Người dùng --- */}
          {errorUsers ? (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#B91C1C",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
              role="alert"
            >
              <strong style={{ fontWeight: "700" }}>LỖI TẢI NGƯỜI DÙNG:</strong>
              <span style={{ marginLeft: "8px" }}>{errorUsers}</span>
            </div>
          ) : loadingUsers ? (
            <div
              style={{ textAlign: "center", padding: "48px", color: "#9CA3AF" }}
            >
              Đang tải danh sách người dùng...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "48px", color: "#9CA3AF" }}
            >
              <h3
                style={{
                  marginTop: "16px",
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "#111827",
                }}
              >
                Chưa có người dùng nào được đăng ký.
              </h3>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={{ ...styles.th, borderTopLeftRadius: "8px" }}>
                      ID (Rút gọn)
                    </th>
                    <th style={styles.th}>TÊN NGƯỜI DÙNG</th>
                    <th style={styles.th}>EMAIL</th>
                    <th style={styles.th}>THỜI GIAN ĐĂNG KÝ</th>
                    <th
                      style={{
                        ...styles.th,
                        textAlign: "right",
                        borderTopRightRadius: "8px",
                      }}
                    >
                      HÀNH ĐỘNG
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "white" }}>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id ? user._id.toString() : index}
                      style={{ borderBottom: "1px solid #F3F4F6" }}
                    >
                      <td style={styles.td}>{user._id.slice(0, 4)}...</td>
                      <td style={styles.td}>{user.name || "Không tên"}</td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        {new Date(user.registeredAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        {/* Nút Xóa (Giả định) */}
                        <button
                          style={{
                            ...styles.deleteButton,
                            padding: "6px 10px",
                            fontSize: "14px",
                          }}
                          // onClick={() => handleDeleteUser(user._id)} // Thêm hàm delete nếu cần
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <footer
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#6B7280",
          fontSize: "14px",
        }}
      >
        Bảng quản trị được thiết kế và phát triển bằng React + Custom CSS.
      </footer>

      {/* Modal Thêm Sản Phẩm */}
      <AddProductFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddProduct={handleAddProduct}
      />

      {/* Modal Xác nhận Xóa Sản Phẩm */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        product={productToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
};

export default Dashboard;
