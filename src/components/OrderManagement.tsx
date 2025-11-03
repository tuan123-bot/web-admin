import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// 🧩 Kiểu dữ liệu Đơn hàng (đồng bộ Backend)
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Confirmed";

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
  };
  totalAmount: number;
  isPaid: boolean;
  status: OrderStatus;
  createdAt: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_ORDERS_URL = "http://localhost:5000/api/orders";

  // 🧠 Lấy danh sách đơn hàng
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<Order[]>(API_ORDERS_URL);
      if (Array.isArray(response.data)) {
        setOrders(
          response.data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } else {
        setOrders([]);
      }
      setError("");
    } catch (err: any) {
      console.error(
        "Lỗi khi tải đơn hàng:",
        err.response?.data?.message || err.message
      );
      setError("Không thể tải danh sách đơn hàng. Kiểm tra Server Backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ⚙️ Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    if (
      !window.confirm(
        `Cập nhật trạng thái đơn hàng ${orderId} thành "${newStatus}"?`
      )
    )
      return;
    try {
      await axios.put(`${API_ORDERS_URL}/${orderId}`, { status: newStatus });
      alert(`Đơn hàng ${orderId} đã được cập nhật!`);
      fetchOrders();
    } catch (err: any) {
      console.error(
        "Lỗi cập nhật trạng thái:",
        err.response?.data?.message || err.message
      );
      alert("Không thể cập nhật trạng thái đơn hàng.");
    }
  };

  // 💰 Định dạng tiền tệ
  const formatCurrency = (amount: number | null | undefined) =>
    (amount || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  if (loading) return <div>Đang tải danh sách đơn hàng...</div>;
  if (error)
    return <div style={{ color: "red", padding: "20px" }}>Lỗi: {error}</div>;

  return (
    <div className="order-management">
      <h2>📦 Quản lý Đơn hàng ({orders.length} đơn)</h2>

      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>ID ĐH</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(0, 8)}...</td>
                <td>
                  <strong>{order.user?.name || "Khách vãng lai"}</strong>
                  <br />
                  <small>({order.user?.email || "N/A"})</small>
                </td>
                <td>{formatCurrency(order.totalAmount)}</td>
                <td>
                  <span className={`status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        order._id,
                        e.target.value as OrderStatus
                      )
                    }
                  >
                    <option value="Pending">Chờ xử lý</option>
                    <option value="Confirmed">Đã xác nhận</option>
                    <option value="Shipped">Đã giao hàng</option>
                    <option value="Delivered">Đã nhận hàng</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderManagement;
