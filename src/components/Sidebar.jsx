// components/Sidebar.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../css/Sidebar.css"; // Tạo file CSS này để style

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">📊 Dashboard (Doanh thu)</Link>
          </li>
          <li>
            <Link to="/orders">📦 Quản lý Đơn hàng</Link>
          </li>
          <li>
            <Link to="/products">💻 Quản lý Sản phẩm</Link>
          </li>
          <li>
            <Link to="/users">👥 Quản lý Người dùng</Link>
          </li>
          <li>
            <Link to="/banners">🖼️ Quản lý Banner</Link>
          </li>
          {/* Bạn có thể thêm nút đăng xuất giả định nếu muốn */}
          <li className="logout-btn-container">
            <button onClick={() => alert("Đăng xuất giả định")}>
              Đăng xuất
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
