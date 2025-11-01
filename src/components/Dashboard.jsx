import React, { useState, useEffect, useCallback } from "react";
import AddProductFormModal from "./AddProductFormModal";
import ProductRow from "./ProductRow";
import { styles } from "../utils/constants";

// ---------------------------
// Render thẻ trạng thái / vai trò
// ---------------------------
const renderStatusTag = (text, type = "status") => {
  let color = styles.tagDefault;

  if (type === "status") {
    if (text?.toLowerCase().includes("pending") || text?.includes("chờ"))
      color = styles.tagYellow;
    else if (
      text?.toLowerCase().includes("confirmed") ||
      text?.includes("hoàn thành")
    )
      color = styles.tagGreen;
    else if (text?.toLowerCase().includes("cancelled") || text?.includes("hủy"))
      color = styles.tagRed;
  } else if (type === "role") {
    if (text?.toLowerCase() === "admin") color = styles.tagRed;
    else if (text?.toLowerCase() === "user") color = styles.tagBlue;
  }

  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        backgroundColor: color?.backgroundColor || "#E5E7EB",
        color: color?.color || "#111827",
        fontSize: 13,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {text || "N/A"}
    </span>
  );
};

// ---------------------------
// COMPONENT CHÍNH: Dashboard
// ---------------------------
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ---------------------------
  // Fetch dữ liệu theo tab
  // ---------------------------
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = `http://localhost:5000/api/${activeTab}`;
      const res = await fetch(endpoint);
      const apiData = await res.json();
      setData(apiData[activeTab] || apiData.data || apiData || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
    setSearchTerm("");
  }, [fetchData]);

  // ---------------------------
  // Thêm sản phẩm
  // ---------------------------
  const handleAddProduct = async (newProduct) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        await fetchData();
        alert(`✅ Thêm sản phẩm "${newProduct.title}" thành công!`);
      } else alert("❌ Lỗi khi thêm sản phẩm!");
    } catch (err) {
      console.error(err);
      alert("Không thể thêm sản phẩm!");
    } finally {
      setLoading(false);
      setIsAddModalOpen(false);
    }
  };

  // ---------------------------
  // Xóa sản phẩm
  // ---------------------------
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert(`🗑️ Đã xóa sản phẩm "${name}"`);
        fetchData();
      } else alert("❌ Lỗi khi xóa sản phẩm!");
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối tới server!");
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------------------------
  // Lọc dữ liệu theo ô tìm kiếm
  // ---------------------------
  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    if (activeTab === "products")
      return (
        item.title?.toLowerCase().includes(term) ||
        item.name?.toLowerCase().includes(term)
      );
    if (activeTab === "orders")
      return (
        item.customerName?.toLowerCase().includes(term) ||
        item.user?.name?.toLowerCase().includes(term)
      );
    if (activeTab === "users")
      return (
        item.name?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
      );
    return false;
  });

  // ---------------------------
  // STYLE bảng
  // ---------------------------
  const tableContainerStyle = {
    width: "100%",
    overflowX: "auto",
    backgroundColor: "white",
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    marginBottom: 24,
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  };

  const thStyle = {
    padding: "12px 16px",
    fontWeight: 700,
    fontSize: 14,
    borderBottom: "2px solid #E5E7EB",
    backgroundColor: "#F3F4F6",
    color: "#111827",
  };

  const tdStyle = {
    padding: "10px 16px",
    borderBottom: "1px solid #E5E7EB",
    color: "#1F2937",
    fontSize: 14,
    verticalAlign: "middle",
  };

  const getRowColor = (i) => (i % 2 === 0 ? "#FFFFFF" : "#F9FAFB");

  // ---------------------------
  // RENDER BẢNG DỮ LIỆU
  // ---------------------------
  const renderTableContent = () => {
    if (loading || isDeleting)
      return <div style={styles.loading}>⏳ Đang tải dữ liệu...</div>;
    if (filteredData.length === 0)
      return (
        <div
          style={{
            ...tableContainerStyle,
            textAlign: "center",
            padding: 30,
            color: "#374151",
          }}
        >
          Không có dữ liệu.
        </div>
      );

    switch (activeTab) {
      // ----- SẢN PHẨM -----
      case "products":
        return (
          <>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                📦 Sản phẩm ({filteredData.length})
              </h2>
              <button
                style={styles.addButton}
                onClick={() => setIsAddModalOpen(true)}
              >
                ➕ Thêm sản phẩm
              </button>
            </div>

            <div style={tableContainerStyle}>
              <table style={{ ...tableStyle, tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>

                <thead>
                  <tr>
                    {[
                      "ID",
                      "Tên",
                      "Giá",
                      "Kho",
                      "Ảnh",
                      "Mô tả",
                      "Hành động",
                    ].map((h) => (
                      <th key={h} style={thStyle}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((p, i) => (
                    <tr
                      key={p._id}
                      style={{
                        backgroundColor: getRowColor(i),
                        verticalAlign: "middle",
                      }}
                    >
                      <td style={tdStyle}>{p._id?.slice(0, 8)}...</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>
                        {p.title || p.name || "N/A"}
                      </td>
                      <td style={{ ...tdStyle, color: "#059669" }}>
                        {(p.price || 0)?.toLocaleString("vi-VN")} ₫
                      </td>
                      <td style={tdStyle}>{p.stock || 0}</td>
                      <td style={tdStyle}>
                        <img
                          src={p.image || p.thumbnail || "placeholder.jpg"}
                          alt={p.title}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid #E5E7EB",
                          }}
                        />
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          maxWidth: 250,
                        }}
                        title={p.description}
                      >
                        {p.description || "N/A"}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() =>
                            handleDeleteProduct(p._id, p.title || p.name)
                          }
                          style={styles.deleteButton}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      // ----- ĐƠN HÀNG -----
      case "orders":
        return (
          <>
            <h2 style={styles.sectionTitle}>
              🧾 Đơn hàng ({filteredData.length})
            </h2>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {[
                      "Mã ĐH",
                      "Khách hàng",
                      "Tổng tiền",
                      "Trạng thái",
                      "Ngày",
                    ].map((h) => (
                      <th key={h} style={thStyle}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((o, i) => (
                    <tr key={o._id} style={{ backgroundColor: getRowColor(i) }}>
                      <td style={tdStyle}>{o._id?.slice(0, 8)}...</td>
                      <td style={tdStyle}>
                        {o.customerName || o.user?.name || "N/A"}
                      </td>
                      <td style={tdStyle}>
                        {(o.totalAmount || o.totalPrice)?.toLocaleString(
                          "vi-VN"
                        ) || 0}{" "}
                        ₫
                      </td>
                      <td style={tdStyle}>
                        {renderStatusTag(o.status || "Chờ xử lý")}
                      </td>
                      <td style={tdStyle}>
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleDateString("vi-VN")
                          : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      // ----- NGƯỜI DÙNG -----
      case "users":
        return (
          <>
            <h2 style={styles.sectionTitle}>
              👤 Người dùng ({filteredData.length})
            </h2>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {["ID", "Tên", "Email", "Vai trò", "Ngày đăng ký"].map(
                      (h) => (
                        <th key={h} style={thStyle}>
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((u, i) => (
                    <tr key={u._id} style={{ backgroundColor: getRowColor(i) }}>
                      <td style={tdStyle}>{u._id?.slice(0, 8)}...</td>
                      <td style={tdStyle}>{u.name || "N/A"}</td>
                      <td style={tdStyle}>{u.email || "N/A"}</td>
                      <td style={tdStyle}>
                        {renderStatusTag(u.role || "user", "role")}
                      </td>
                      <td style={tdStyle}>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                          : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // ---------------------------
  // GIAO DIỆN CHÍNH
  // ---------------------------
  return (
    <div
      style={{
        backgroundColor: "#F3F4F6",
        color: "#111827",
        padding: "32px 60px",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#111827" }}>
          🏪 Admin Dashboard
        </h1>

        <div style={{ display: "flex", gap: 12 }}>
          {["products", "orders", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid #10B981",
                backgroundColor: activeTab === tab ? "#10B981" : "white",
                color: activeTab === tab ? "white" : "#10B981",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab === "products"
                ? "Sản phẩm"
                : tab === "orders"
                ? "Đơn hàng"
                : "Người dùng"}
            </button>
          ))}
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #D1D5DB",
            backgroundColor: "white",
            color: "#111827",
            fontSize: 14,
          }}
          placeholder={`🔍 Tìm kiếm ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: "10px 16px",
            backgroundColor: "#10B981",
            color: "white",
            borderRadius: 8,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Đang tải..." : "🔄 Tải lại"}
        </button>
      </div>

      {/* Bảng dữ liệu */}
      {renderTableContent()}

      {/* Modal thêm sản phẩm */}
      <AddProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default Dashboard;
