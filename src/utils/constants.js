// utils/constants.js

// ----------------------------------------------------------------------
// --- FORM STYLES ---
// ----------------------------------------------------------------------
export const formStyles = {
  input: {
    padding: "10px 14px",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    width: "100%",
    marginBottom: "16px",
    fontSize: "15px",
    transition: "all 0.2s ease",
    outline: "none",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#374151",
    fontSize: "14px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#10B981",
    color: "white",
    borderRadius: "10px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(16, 185, 129, 0.4)",
    transition: "all 0.2s ease-in-out",
    minWidth: "120px",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#F9FAFB",
    color: "#374151",
    borderRadius: "10px",
    border: "1px solid #E5E7EB",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
  modalContentAdd: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 10px 25px rgba(16, 185, 129, 0.25)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    transition: "transform 0.3s ease-in-out",
  },
};

// ----------------------------------------------------------------------
// --- GLOBAL & COMPONENT STYLES (FULL WIDTH VERSION) ---
// ----------------------------------------------------------------------
export const styles = {
  // App container full màn hình
  appContainer: {
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#F9FAFB",
    padding: "32px 48px",
    fontFamily: "'Inter', sans-serif",
    color: "#1F2937",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  // Header
  headerTitle: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#4F46E5",
    marginBottom: "8px",
  },
  headerSubtitle: {
    color: "#6B7280",
    fontSize: "18px",
    marginBottom: "24px",
  },

  // Card (chiếm hết chiều ngang)
  card: {
    backgroundColor: "#FFFFFF",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E5E7EB",
    width: "100%",
    marginBottom: "24px",
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.2)",
    border: "1px solid #E0E7FF",
    transition: "transform 0.3s ease",
    cursor: "default",
    width: "100%",
  },
  summaryCardIconContainer: {
    backgroundColor: "#EEF2FF",
    padding: "12px",
    borderRadius: "9999px",
    marginRight: "16px",
  },
  summaryCardIcon: {
    height: "24px",
    width: "24px",
    color: "#4F46E5",
  },
  summaryCardTextSmall: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#6B7280",
  },
  summaryCardTextLarge: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#3730A3",
    marginTop: "4px",
  },

  // Table (full width)
  tableHeader: {
    backgroundColor: "#EEF2FF",
    borderBottom: "2px solid #C7D2FE",
  },
  th: {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
    color: "#4F46E5",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tr: {
    borderBottom: "1px solid #F3F4F6",
    transition: "background-color 0.15s ease",
  },
  trHover: {
    backgroundColor: "#F9FBFF",
  },
  td: {
    padding: "14px 20px",
    whiteSpace: "nowrap",
    fontSize: "14px",
    color: "#374151",
  },
  deleteButton: {
    color: "#DC2626",
    padding: "6px 8px",
    borderRadius: "8px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
  },

  // Modal (xóa)
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    backdropFilter: "blur(4px)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px",
    width: "90%",
    maxWidth: "420px",
    boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    transition: "transform 0.3s ease-in-out",
  },

  // Nút thêm sản phẩm
  addButton: {
    backgroundColor: "#10B981",
    color: "#FFFFFF",
    padding: "12px 20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(16, 185, 129, 0.4)",
    transition: "all 0.2s ease-in-out",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

// ----------------------------------------------------------------------
// --- API CONFIG ---
// ----------------------------------------------------------------------
export const BASE_URL = "http://localhost:5000";
export const API_URL = `${BASE_URL}/api/products`;
