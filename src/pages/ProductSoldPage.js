import React, { useState, useEffect } from "react"; 
import api from "../api";
import { FaSearch } from "react-icons/fa";
import "../styles/ProductSoldPage.css";

const ProductSoldPage = () => {
  const [soldData, setSoldData] = useState([]);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [groupedSales, setGroupedSales] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [cancelModal, setCancelModal] = useState({ isOpen: false, timestamp: "" });
  


  const filteredSoldData = soldData.filter(item => {
  const search = searchInput.toLowerCase();
  return (
    (item.PRODUCT_NAME?.toLowerCase().includes(search)) ||
    (item.BRAND?.toLowerCase().includes(search)) ||
    (item.UNIT_PRICE?.toString().includes(search)) ||
    (item.QUANTITY_SOLD?.toString().includes(search)) ||
    (item.PRICE?.toString().includes(search)) ||
    (item.TOTAL_AMOUNT?.toString().includes(search)) ||
    (item.EXPIRATION_DATE ? new Date(item.EXPIRATION_DATE).toLocaleDateString().includes(search) : false) ||
    (item.CATEGORY?.toLowerCase().includes(search)) ||
    (item.TIMESTAMP ? new Date(item.TIMESTAMP).toLocaleString().includes(search) : false)
  );
});

const filteredGroupedSales = {};
Object.keys(groupedSales).forEach(timestamp => {
  const filteredItems = groupedSales[timestamp].filter(item =>
    filteredSoldData.includes(item)
  );
  if (filteredItems.length > 0) filteredGroupedSales[timestamp] = filteredItems;
});



  // Format timestamp nicely
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleString();
  };

  // Fetch sold products (defined outside useEffect)
  const fetchSoldData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to view sales data.");
        return;
      }

      const response = await api.get(
        "/productsold/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data || response.data.length === 0) {
        setSoldData([]);
        setError("No sold products found.");
        setNotification("");
        setGroupedSales({});
      } else {
        // Only display non-cancelled products
        const activeSold = response.data.filter(item => !item.CANCELLED);
        setSoldData(activeSold);
        setGroupedSales(groupByTimestamp(activeSold));
        setError("");
        setNotification("");
      }
    } catch (err) {
      console.error(err);
      setSoldData([]);
      setError("Error fetching sales data.");
      setNotification("");
      setGroupedSales({});
    }
  };

  useEffect(() => {
    fetchSoldData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group sold products by timestamp
  const groupByTimestamp = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const time = new Date(item.TIMESTAMP).toLocaleString();
      if (!grouped[time]) grouped[time] = [];
      grouped[time].push(item);
    });
    return grouped;
  };
   
const handleCancel = (timestamp) => {
  setCancelModal({ isOpen: true, timestamp });
};

const confirmCancel = async () => {
  const timestamp = cancelModal.timestamp;
  try {
    const token = localStorage.getItem("authToken");
    const itemsToCancel = groupedSales[timestamp] || [];

    await Promise.all(
      itemsToCancel.map(item =>
        api.post(
          "/cancelledpurchase/cancel",
          { PRODUCT_SOLD_ID: item._id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      )
    );

    const updatedGroupedSales = { ...groupedSales };
    delete updatedGroupedSales[timestamp];
    setGroupedSales(updatedGroupedSales);

    const updatedSoldData = soldData.filter(
      item => !itemsToCancel.some(cancelItem => cancelItem._id === item._id)
    );
    setSoldData(updatedSoldData);

    setNotification(`Sold products at ${timestamp} have been cancelled successfully.`);
    setError("");
  } catch (err) {
    console.error("❌ Cancel error:", err);
    setError("Failed to cancel sold products.");
  } finally {
    setCancelModal({ isOpen: false, timestamp: "" });
  }
};


  return (
    <div className="product-sold-container">
      <h2>Product Sold Details</h2>
      <div className="search-container">
          <FaSearch className="search-icon" />
  <input
    type="text"
    placeholder="Search sold products..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
  />
 
</div>


      {notification && <p className="notification-message">{notification}</p>}
      {error && <p className="error-message">{error}</p>}
{soldData.length > 0 && ( 
  <div className="sold-data">
    <h3>Overall Sales:</h3>
    <table className="sold-table">
      <thead>
        <tr>
          <th>No.</th> {/* Numbering column */}
          <th>PRODUCT NAME</th>
          <th>BRAND</th>
          <th>UNIT PRICE</th>
          <th>QUANTITY SOLD</th>
          <th>PRICE</th>
          <th>TOTAL AMOUNT</th>
          <th>EXPIRATION DATE</th>
          <th>CATEGORY</th>
          <th>TIMESTAMP</th>
        </tr>
      </thead>
      <tbody>
        {filteredSoldData.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td> {/* Row number */}
            <td>{item.PRODUCT_NAME ?? "-"}</td>
            <td>{item.BRAND ?? "-"}</td>
            <td>₱{item.UNIT_PRICE?.toFixed(2) ?? "0.00"}</td>
            <td>{item.QUANTITY_SOLD ?? "0"}</td>
            <td>₱{item.PRICE?.toFixed(2) ?? "0.00"}</td>
            <td>₱{item.TOTAL_AMOUNT?.toFixed(2) ?? "0.00"}</td>
            <td>{item.EXPIRATION_DATE ? new Date(item.EXPIRATION_DATE).toLocaleDateString() : "-"}</td>
            <td>{item.CATEGORY ?? "-"}</td>
            <td>{formatDateTime(item.TIMESTAMP)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      {Object.keys(groupedSales).map((timestamp) => (
        <div key={timestamp} className="sold-group">
          <h3>Date Sold: {timestamp}</h3>
          <table className="sold-table">
            <thead>
              <tr>
                <th>PRODUCT NAME</th>
                <th>BRAND</th>
                <th>UNIT PRICE</th>
                <th>QUANTITY SOLD</th>
                <th>PRICE</th>
                <th>TOTAL AMOUNT</th>
                <th>EXPIRATION DATE</th>
                <th>CATEGORY</th>
              </tr>
            </thead>
            <tbody>
              {groupedSales[timestamp].map((item, index) => (
                <tr key={index}>
                  <td>{item.PRODUCT_NAME ?? "-"}</td>
                  <td>{item.BRAND ?? "-"}</td>
                  <td>₱{item.UNIT_PRICE?.toFixed(2) ?? "0.00"}</td>
                  <td>{item.QUANTITY_SOLD ?? "0"}</td>
                  <td>₱{item.PRICE?.toFixed(2) ?? "0.00"}</td>
                  <td>₱{item.TOTAL_AMOUNT?.toFixed(2) ?? "0.00"}</td>
                  <td>{item.EXPIRATION_DATE ? new Date(item.EXPIRATION_DATE).toLocaleDateString() : "-"}</td>
                  <td>{item.CATEGORY ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {cancelModal.isOpen && (
  <div className="cancel-modal-overlay">
    <div className="cancel-modal-content">
      <h2>⚠️ Confirm Cancel</h2>
      <p>Are you sure you want to cancel all sold products at <strong>{cancelModal.timestamp}</strong>?</p>
      <div className="cancel-modal-buttons">
        <button onClick={confirmCancel}>Yes, Cancel</button>
        <button onClick={() => setCancelModal({ isOpen: false, timestamp: "" })}>No</button>
      </div>
    </div>
  </div>
)}


            <div className="button-container">
      <button onClick={() => handleCancel(timestamp)}>Cancel</button>
    </div>

        </div>
      ))}

    </div>
  );
};

export default ProductSoldPage;
