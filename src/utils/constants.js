// utils/constants.js
export const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "2px solid #EEE",
    paddingBottom: "10px",
  },
  title: {
    color: "#10B981",
    margin: 0,
  },
  tabs: {
    display: "flex",
    gap: "10px",
  },
  tabButton: {
    padding: "10px 15px",
    border: "1px solid #10B981",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
  },
  searchContainer: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "1.2em",
    color: "#4B5563",
  },
  tableContainer: {
    marginTop: "30px",
    overflowX: "auto",
  },
  sectionTitle: {
    color: "#374151",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FFF",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

// Styles cho Form (được dùng trong Dashboard và Modal)
export const formStyles = {
  label: {
    display: "block",
    marginBottom: "5px",
    marginTop: "10px",
    fontWeight: "600",
    color: "#4B5563",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #D1D5DB",
    borderRadius: "5px",
    boxSizing: "border-box",
  },
  submitButton: {
    backgroundColor: "#10B981",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "bold",
    marginTop: "15px",
    transition: "background-color 0.3s",
  },
};
