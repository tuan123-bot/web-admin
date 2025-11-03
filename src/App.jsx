// App.jsx (Đã hoàn thiện Routing)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Đảm bảo đường dẫn import này là chính xác
import Dashboard from "./components/Dashboard.tsx"; // Đã đổi tên thành .tsx
import OrderManagement from "./components/OrderManagement.tsx";
import ProductManagement from "./components/ProductManagement.tsx";
import UserManagement from "./components/UserManagement.tsx";
import AppLayout from "./components/AppLayout"; // Đã sửa đường dẫn nếu nó nằm trong /components
import BannerManagement from "./components/BannerManagement.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
