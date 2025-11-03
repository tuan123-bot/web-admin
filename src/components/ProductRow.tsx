import React from "react";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  description: string;
  thumbnail?: string;
}

interface ProductRowProps {
  product: Product;
  onDelete: (id: string) => Promise<void>;
  onEdit: (product: Product) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onDelete,
  onEdit,
}) => {
  const BASE_URL = "http://localhost:5000";
  const imageUrl = product.thumbnail ? `${BASE_URL}${product.thumbnail}` : "";

  return (
    <tr>
      {/* ID */}
      <td>{product._id.slice(0, 8)}...</td>

      {/* Ảnh */}
      <td style={{ width: 80, textAlign: "center" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            style={{ width: "100%", maxHeight: 50, objectFit: "contain" }}
          />
        ) : (
          <span style={{ color: "#999", fontSize: "0.8em" }}>(Không ảnh)</span>
        )}
      </td>

      {/* Tên sản phẩm */}
      <td>{product.title}</td>

      {/* Giá */}
      <td>{product.price.toLocaleString()} VNĐ</td>

      {/* Kho */}
      <td style={{ width: 70, textAlign: "center" }}>
        {Number(product.stock) > 0 ? (
          <span style={{ color: "#27AE60", fontWeight: "bold" }}>
            {product.stock}
          </span>
        ) : (
          <span style={{ color: "#E74C3C", fontWeight: "bold" }}>Hết hàng</span>
        )}
      </td>

      {/* Hành động */}
      <td>
        <button
          onClick={() => onEdit(product)}
          className="btn-edit"
          style={{ marginRight: 10, padding: "5px 10px" }}
        >
          ✏️ Sửa
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="btn-delete"
          style={{
            padding: "5px 10px",
            background: "red",
            color: "#fff",
            border: "none",
          }}
        >
          🗑️ Xóa
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
