// components/Dashboard.tsx

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../css/Dashboard.css";

// Định nghĩa Interface Order
interface Order {
  _id: string;
  totalAmount: number;
  isPaid: boolean;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_ORDERS_URL = "http://localhost:5000/api/orders";

  const calculateStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<Order[]>(API_ORDERS_URL);
      const apiData = response.data;

      // 🎯 Kiểm tra an toàn: đảm bảo orders là mảng
      const orders = Array.isArray(apiData) ? apiData : [];

      let totalRevenue = 0;
      let deliveredOrders = 0;
      let pendingOrders = 0;

      orders.forEach((order) => {
        if (order.status === "Delivered") {
          totalRevenue += order.totalAmount;
          deliveredOrders += 1;
        } else if (
          order.status === "Pending" ||
          order.status === "Processing"
        ) {
          pendingOrders += 1;
        }
      });

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        deliveredOrders,
        pendingOrders,
      });

      setError("");
    } catch (err: any) {
      console.error(
        "Lỗi khi tải dữ liệu thống kê:",
        err.response?.data?.message || err.message
      );
      setError(
        "Lỗi: Không thể tải dữ liệu Dashboard. Kiểm tra Server Backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  if (loading) return <div>Đang tải dữ liệu Dashboard...</div>;
  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;

  return (
    <div className="dashboard">
      <h2>📊 Bảng Điều khiển & Thống kê Doanh thu</h2>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <h4>💰 Tổng Doanh thu</h4>
          <p className="value">{formatCurrency(stats.totalRevenue)}</p>
          <small>*Tính từ các đơn hàng Đã giao hàng</small>
        </div>

        <div className="stat-card orders">
          <h4>🛒 Tổng số Đơn hàng</h4>
          <p className="value">{stats.totalOrders}</p>
        </div>

        <div className="stat-card delivered">
          <h4>✅ Đơn hàng Đã giao</h4>
          <p className="value">{stats.deliveredOrders}</p>
        </div>

        <div className="stat-card pending">
          <h4>⏳ Đơn hàng Chờ xử lý</h4>
          <p className="value">{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
