import React, { useEffect, useState, useCallback} from "react";
import api from "../api"; 
import '../styles/CancelledPurchasePage.css';
import { FaSearch } from "react-icons/fa";




const CancelledPurchasePage = () => {
  const [groupedCancelled, setGroupedCancelled] = useState({});
  const [error, setError] = useState("");
  const [allCancelledItems, setAllCancelledItems] = useState([]); // ✅ store all data for searching
  const [searchInput, setSearchInput] = useState(""); // ✅ add search state

  // Format date nicely
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleString();
  };

  
  // Group cancelled products by CANCELLED_AT date
  const groupByCancelledAt = useCallback((data) => {
    const grouped = {};
    data.forEach((item) => {
      const time = formatDateTime(item.CANCELLED_AT);
      if (!grouped[time]) grouped[time] = [];
      grouped[time].push(item);
    });
    return grouped;
  }, 
  []);

  // 1. Filter cancelled items based on search input
const filteredCancelledData = allCancelledItems.filter(item => {
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
    (item.CANCELLED_AT ? new Date(item.CANCELLED_AT).toLocaleString().toLowerCase().includes(search) : false)
  );
});

// 2. Regroup cancelled items by CANCELLED_AT
const filteredGroupedCancelled = {};
Object.keys(groupedCancelled).forEach(cancelledAt => {
  const filteredItems = groupedCancelled[cancelledAt].filter(item =>
    filteredCancelledData.includes(item)
  );
  if (filteredItems.length > 0) filteredGroupedCancelled[cancelledAt] = filteredItems;
});


  // Fetch all cancelled purchases for current admin
  const fetchCancelledData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to view cancelled purchases.");
        return;
      }

      const response = await api.get(
        "/cancelledpurchase/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data || response.data.length === 0) {
        setGroupedCancelled({});
        setAllCancelledItems([]); // ✅ reset stored items
        setError("No cancelled purchases found.");
      } else {
        setGroupedCancelled(groupByCancelledAt(response.data));
        setAllCancelledItems(response.data); // ✅ store raw items
        setError("");
      }
    } catch (err) {
      console.error(err);
      setGroupedCancelled({});
      setError("Failed to fetch cancelled purchases.");
    }
  }, [groupByCancelledAt]);

  useEffect(() => {
    fetchCancelledData();
  }, [fetchCancelledData]);

  return (
    <div className="cancelled-container">
      <h2>Cancelled Purchases</h2>
       <div className="search-containe">
               <FaSearch className="search-icon" />
       <input
         type="text"
         placeholder="Search sold products..."
         value={searchInput}
         onChange={(e) => setSearchInput(e.target.value)}
       />
      
     </div>

      {error && <p className="error-message">{error}</p>}
{Object.keys(filteredGroupedCancelled).length > 0 &&
  Object.keys(filteredGroupedCancelled).map((timestamp) => (
    <div key={timestamp} className="cancelled-group">
      <h3>Cancelled Date: {timestamp}</h3>
      <table className="cancelled-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Unit Price</th>
            <th>Quantity Sold</th>
            <th>Price</th>
            <th>Total Amount</th>
            <th>Expiration Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroupedCancelled[timestamp].map((item, index) => (
            <tr key={index}>
              <td>{item.PRODUCT_NAME ?? "-"}</td>
              <td>{item.BRAND ?? "-"}</td>
              <td>₱{item.UNIT_PRICE?.toFixed(2) ?? "0.00"}</td>
              <td>{item.QUANTITY_SOLD ?? "0"}</td>
              <td>₱{item.PRICE?.toFixed(2) ?? "0.00"}</td>
              <td>₱{item.TOTAL_AMOUNT?.toFixed(2) ?? "0.00"}</td>
              <td>
                {item.EXPIRATION_DATE
                  ? new Date(item.EXPIRATION_DATE).toLocaleDateString()
                  : "-"}
              </td>
              <td>{item.CATEGORY ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))}

    </div>
  );
};

export default CancelledPurchasePage;
