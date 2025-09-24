// LowStocksPage.js
import React, { useEffect, useState } from 'react';
import api from "../api";
import { jwtDecode } from 'jwt-decode';
import { FaSearch, FaEdit } from 'react-icons/fa';
import { Trash } from '@styled-icons/fa-solid/Trash';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/LowStocksPage.css';

const LowStocksPage = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: '',
  });

  
  const categories = [
    "Medicine",
    "Health & Personal Care",
    "Beauty & Cosmetic",
    "Miscellaneous",
    "Others",
  ];
  
  const [customCategory, setCustomCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
   
  
  
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    if (name === "CATEGORY") {
      setUpdatedData({ ...updatedData, CATEGORY: value });
      if (value !== "Others") setCustomCategory("");
      setDropdownOpen(false);
    } else if (name === "CUSTOM_CATEGORY") {
      setCustomCategory(value);
      setUpdatedData({ ...updatedData, CATEGORY: value });
    } else {
      setUpdatedData({ ...updatedData, [name]: value });
    }
  };
  

  const getAdminId = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.ADMIN_ID || null;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const adminId = getAdminId();

      if (!token || !adminId) {
        setError('Authentication failed. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/products/low-stock', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLowStockProducts(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching low-stock products:', err);
        setError('Failed to fetch low-stock products.');
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  const filterProducts = (list) =>
    list.filter(
      (p) =>
        p.PRODUCT_NAME.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.BRAND.toLowerCase().includes(searchInput.toLowerCase()) ||
        (p.CATEGORY && p.CATEGORY.toLowerCase().includes(searchInput.toLowerCase()))
    );

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setUpdatedData(product);
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      await api.put(
        `/products/${selectedProduct._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLowStockProducts((prev) =>
        prev.map((p) => (p._id === selectedProduct._id ? { ...p, ...updatedData } : p))
      );

      setEditMode(false);
      setSelectedProduct(null);
      setSuccessMessage(`"${updatedData.PRODUCT_NAME}" updated successfully.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product.');
    }
  };

 const handleDelete = (productId, productName) => {
  setDeleteModal({ isOpen: true, productId, productName });
};

const confirmDelete = async () => {
  if (!deleteModal.productId) return;
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    await api.delete(`/products/${deleteModal.productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setLowStockProducts((prev) =>
      prev.filter((p) => p._id !== deleteModal.productId)
    );

    setSuccessMessage(`"${deleteModal.productName}" deleted successfully.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  } catch (err) {
    console.error('Error deleting product:', err);
    setError('Failed to delete product.');
  } finally {
    setDeleteModal({ isOpen: false, productId: null, productName: '' });
  }
};

  if (loading) return <div>Loading low-stock products...</div>;

  const filteredLowStock = filterProducts(lowStockProducts);

  return (
    <div className="product-container">
      <h2>Low Stock Products</h2>

      <div className="search-containers">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search low-stock products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      {filteredLowStock.length === 0 ? (
        <p>No low-stock products found.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Expiration</th>
              <th>Category</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLowStock.map((p) => (
              <tr key={p._id}>
                <td>{p.PRODUCT_NAME}</td>
                <td>{p.BRAND}</td>
                <td>{p.UNIT_PRICE}</td>
                <td style={{ color: p.QUANTITY <= 2 ? 'red' : 'black' }}>{p.QUANTITY}</td>
                <td>{new Date(p.EXPIRATION_DATE).toLocaleDateString()}</td>
                <td>{p.CATEGORY}</td>
                <td>{new Date(p.TIMESTAMP).toLocaleString()}</td>
                <td>
                 <td className="action-buttons">
  <button
    className="edit-button-producty"
    onClick={() => handleEditClick(p)}
  >
    <FaEdit />
  </button>
  <button
    className="delete-button-producty"
    onClick={() => handleDelete(p._id, p.PRODUCT_NAME)}
  >
    <Trash width={18} />
  </button>
</td>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

   
   {editMode && selectedProduct && (
     <div className="product-edit-modal-overlay" onClick={() => setEditMode(false)}>
       <div className="product-edit-modal-content" onClick={e => e.stopPropagation()}>
         {/* Title with icon */}
         <div className="product-edit-header">
           <h2>Edit Product</h2>
         </div>
   
         {/* Two-column form */}
         <div className="product-edit-form">
           {/* Left column */}
           <div className="form-column">
             <div className="product-edit-input-group">
               <label>Name:</label>
               <input
                 type="text"
                 name="PRODUCT_NAME"
                 value={updatedData.PRODUCT_NAME}
                 onChange={handleInputChange}
               />
             </div>
             <div className="product-edit-input-group">
               <label>Brand:</label>
               <input
                 type="text"
                 name="BRAND"
                 value={updatedData.BRAND}
                 onChange={handleInputChange}
               />
             </div>
             <div className="product-edit-input-group">
               <label>Price:</label>
               <input
                 type="number"
                 name="UNIT_PRICE"
                 value={updatedData.UNIT_PRICE}
                 onChange={handleInputChange}
               />
             </div>
           </div>
   
           {/* Right column */}
           <div className="form-column">
             <div className="product-edit-input-group">
               <label>Quantity:</label>
               <input
                 type="number"
                 name="QUANTITY"
                 value={updatedData.QUANTITY}
                 onChange={handleInputChange}
               />
             </div>
             <div className="product-edit-input-group">
               <label>Expiration:</label>
               <input
                 type="date"
                 name="EXPIRATION_DATE"
                 value={updatedData.EXPIRATION_DATE?.slice(0, 10)}
                 onChange={handleInputChange}
               />
             </div>
   
   <div className="product-edit-input-group">
     <label>Category:</label>
   
     <div className="category-input-wrapper">
       {/* Input field */}
       <input
         type="text"
         name="CUSTOM_CATEGORY"
         value={
           updatedData.CATEGORY === "Others"
             ? customCategory
             : updatedData.CATEGORY
         }
         onChange={handleCategoryChange}
         placeholder="Select or enter category"
         className="category-input"
         required
         readOnly={updatedData.CATEGORY !== "Others"}
         onClick={() => setDropdownOpen(!dropdownOpen)}
       />
   
       {/* Dropdown icon inside the input box */}
       <FaChevronDown
         className="category-icon"
         onClick={() => setDropdownOpen(!dropdownOpen)}
       />
   
       {/* Dropdown */}
       {dropdownOpen && (
         <div className="category-select-dropdown">
           {categories.map((cat) => (
             <div
               key={cat}
               className="category-option"
               onClick={() => {
                 setUpdatedData({ ...updatedData, CATEGORY: cat });
                 if (cat !== "Others") setCustomCategory(cat);
                 else setCustomCategory("");
                 setDropdownOpen(false);
               }}
             >
               {cat}
             </div>
           ))}
         </div>
       )}
     </div>
   </div>
  </div>
</div>
   
         {/* Buttons */}
         <div className="product-edit-buttons">
           <button onClick={handleUpdate}>Save</button>
           <button onClick={() => setEditMode(false)}>Cancel</button>
         </div>
       </div>
     </div>
   )}

      {/* Delete Modal */}
    {deleteModal.isOpen && (
  <div
    className="delete-modal-overlay"
    onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
  >
    <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
      <h2 className="delete-modal-title">⚠️ Confirm Delete</h2>
      <p className="delete-modal-text">
        Are you sure you want to delete <strong>"{deleteModal.productName}"</strong>?
      </p>
      <div className="delete-modal-buttons">
        <button className="delete-btn" onClick={confirmDelete}>Yes, Delete</button>
        <button
          className="cancel-btn"
          onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default LowStocksPage;
