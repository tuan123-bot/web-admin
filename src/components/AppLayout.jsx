// components/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx"; // Đảm bảo bạn đã tạo Sidebar.jsx
// Sửa lỗi 404: Đường dẫn CSS từ components/ đi lên src/ rồi vào css/
import "../css/AppLayout.css";

function AppLayout() {
  // Header được gộp vào AppLayout để đơn giản hóa
  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="main-content">
        <header className="admin-header">
          <h1>Hệ thống Quản trị Web</h1>
        </header>
        <main className="page-wrapper">
          {/* Nội dung Dashboard, Products, Orders sẽ hiển thị ở đây */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AppLayout;
