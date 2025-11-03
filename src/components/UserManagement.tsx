// components/UserManagement.tsx

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Định nghĩa Interface cho Người dùng
interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_USERS_URL = "http://localhost:5000/api/users"; // API backend của bạn

  // 1. Hàm Tải Danh sách Người dùng
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi API GET /api/users (đã bỏ protect ở backend)
      const response = await axios.get<User[]>(API_USERS_URL);
      setUsers(response.data);
      setError("");
    } catch (err) {
      console.error("Lỗi khi tải người dùng:", err);
      setError(
        "Không thể tải danh sách người dùng. Vui lòng kiểm tra Server Backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 2. Hàm Xóa Người dùng
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa người dùng "${userName}" không? Thao tác này không thể hoàn tác!`
      )
    ) {
      return;
    }

    try {
      // Gọi API DELETE /api/users/:id (deleteUser)
      await axios.delete(`${API_USERS_URL}/${userId}`);

      // Cập nhật state (loại bỏ người dùng khỏi danh sách)
      setUsers(users.filter((user) => user._id !== userId));
      alert(`Người dùng "${userName}" đã được xóa thành công!`);
    } catch (err) {
      console.error("Lỗi khi xóa người dùng:", err);
      alert("Lỗi khi xóa người dùng. Kiểm tra quyền và API DELETE.");
    }
  };

  if (loading) return <div>Đang tải danh sách người dùng...</div>;
  if (error)
    return <div style={{ color: "red", padding: "20px" }}>Lỗi: {error}</div>;

  return (
    <div className="user-management">
      <h2>👥 Quản lý Người dùng ({users.length} tài khoản)</h2>

      {users.length === 0 ? (
        <p>Không có người dùng nào được đăng ký.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Ngày tham gia</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id.substring(0, 8)}...</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      ✅ CÓ
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>❌ KHÔNG</span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    // Không cho phép Admin tự xóa chính mình hoặc Admin khác (cần logic phức tạp hơn)
                    disabled={user.isAdmin}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
