import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Alert, Spin, Modal } from "antd";
import { DeleteOutlined, UserSwitchOutlined } from "@ant-design/icons";
import "./UserManagement.css";

// Giả định URL backend
const API_URL = "http://localhost:5000/api/users";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  isBlocked: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 🎯 HÀM GỌI API LẤY DANH SÁCH NGƯỜI DÙNG ---
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách người dùng.");
      }
      const data = await response.json();

      const processedUsers = (data.users || data).map((u: User) => ({
        ...u,
        key: u._id, // Thêm key
      }));

      setUsers(processedUsers);
    } catch (err: any) {
      console.error(err);
      setError("Không thể tải người dùng. Vui lòng kiểm tra API Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 🎯 HÀM XỬ LÝ KHÓA/MỞ KHÓA NGƯỜI DÙNG (Giả định) ---
  const handleBlockToggle = (userId: string, isCurrentlyBlocked: boolean) => {
    Modal.confirm({
      title: isCurrentlyBlocked
        ? "Xác nhận Mở khóa"
        : "Xác nhận Khóa tài khoản",
      content: `Bạn có chắc chắn muốn ${
        isCurrentlyBlocked ? "mở khóa" : "khóa"
      } tài khoản này?`,
      okText: isCurrentlyBlocked ? "Mở khóa" : "Khóa",
      okType: isCurrentlyBlocked ? "default" : "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          // Giả định API cho chức năng khóa/mở khóa
          const response = await fetch(`${API_URL}/${userId}/block`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isBlocked: !isCurrentlyBlocked }),
          });

          if (!response.ok) {
            throw new Error("Thao tác thất bại.");
          }
          await fetchUsers();
        } catch (err: any) {
          Modal.error({ title: "Lỗi", content: err.message });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // --- CỘT CHO BẢNG NGƯỜI DÙNG ---
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (text: string) => text.substring(0, 8) + "...",
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: "user" | "admin") => (
        <Tag color={role === "admin" ? "volcano" : "geekblue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked: boolean) => (
        <Tag color={isBlocked ? "red" : "green"}>
          {isBlocked ? "Đã khóa" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_: any, record: User) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<UserSwitchOutlined />}
            size="small"
            danger={!record.isBlocked}
            onClick={() => handleBlockToggle(record._id, record.isBlocked)}
          >
            {record.isBlocked ? "Mở Khóa" : "Khóa"}
          </Button>
          {/* Nút xóa vĩnh viễn (chỉ cho admin) */}
          <Button
            icon={<DeleteOutlined />}
            size="small"
            disabled={record.role === "admin"} // Không cho xóa admin
            danger
            onClick={() =>
              Modal.error({
                title: "Cảnh báo",
                content: "Chức năng xóa vĩnh viễn chưa được triển khai",
              })
            }
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: 20 }}>👤 Quản Lý Người Dùng</h2>

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </div>
  );
};

export default UserManagement;
