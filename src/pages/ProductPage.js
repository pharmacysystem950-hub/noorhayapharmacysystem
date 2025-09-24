import React, { useState, useEffect } from 'react';
import api from "../api";
import { jwtDecode } from 'jwt-decode';
import { FaEdit } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { Trash } from '@styled-icons/fa-solid/Trash';
 
import { FaSearch } from 'react-icons/fa';
import '../styles/ProductPage.css';

const ProductPage = () => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: ''
  });

  const [stockWarning, setStockWarning] = useState(null); // null | "stock" | "expired"


const categories = [
  "Medicine",
  "Health & Personal Care",
  "Beauty & Cosmetic",
  "Miscellaneous",
  "Others",
];

const [customCategory, setCustomCategory] = useState("");
const [dropdownOpen, setDropdownOpen] = useState(false);
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US");


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

  const isExpired = (expDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expDate);
  exp.setHours(0, 0, 0, 0);
  return exp <= today;
};

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const adminId = getAdminId();

      if (!token || !adminId) {
        setError('Authentication failed. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/products/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllProducts(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

      setAllProducts(allProducts.map(p =>
        p._id === selectedProduct._id ? { ...p, ...updatedData } : p
      ));

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

      await api.delete(
        `/products/${deleteModal.productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllProducts(allProducts.filter(p => p._id !== deleteModal.productId));
      setSuccessMessage(`"${deleteModal.productName}" deleted successfully.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product.');
    } finally {
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    }
  };

  const handleCheckboxChange = (product, productId) => {
    setSelectedProducts((prev) => {
      const newSelected = { ...prev };
      if (newSelected[productId]) {
        delete newSelected[productId];
      } else {
        newSelected[productId] = { ...product, quantitySold: 1 };
      }
      return newSelected;
    });
  };

  const handleQuantityChange = (productId, value) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantitySold: Number(value),
      },
    }));
  };
 
  const filterProducts = (list) =>
    list.filter(p =>
      p.PRODUCT_NAME.toLowerCase().includes(searchInput.toLowerCase()) ||
      p.BRAND.toLowerCase().includes(searchInput.toLowerCase()) ||
      (p.CATEGORY && p.CATEGORY.toLowerCase().includes(searchInput.toLowerCase()))
    );

  const totalAmount = Object.values(selectedProducts).reduce(
    (sum, p) => sum + p.UNIT_PRICE * p.quantitySold,
    0
  );

const handlePlaceOrder = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // 1. Check for expired products before doing anything else
    const expiredSelected = Object.values(selectedProducts).some(
      (product) => isExpired(product.EXPIRATION_DATE)
    );
    if (expiredSelected) {
      setStockWarning("expired");
      return;
    }

    // 2. Check for stock issues locally (quantitySold > QUANTITY)
    const insufficientStock = Object.values(selectedProducts).some(
      (product) => product.quantitySold > product.QUANTITY
    );
    if (insufficientStock) {
      setStockWarning("stock");
      return;
    }

    // 3. Proceed with backend request
    const requests = Object.values(selectedProducts).map(product =>
      api.post(
        "/productsold",
        {
          PRODUCT_ID: product._id,
          QUANTITY_SOLD: product.quantitySold,
          PRICE: product.UNIT_PRICE,
          TOTAL_AMOUNT: product.UNIT_PRICE * product.quantitySold,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(err => err.response?.data)
    );

    const results = await Promise.all(requests);

    const hasStockIssues = results.some(res => res && res.error);
    if (hasStockIssues) {
      setStockWarning("stock");
      return;
    }

    // ✅ Success
    alert("Order placed successfully!");
    setShowBuyModal(false);
    setSelectedProducts({});

    // Refresh product list
    const allRes = await api.get("/products/admin", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllProducts(allRes.data);

  } catch (error) {
    console.error("Error placing order:", error);
    setError("Failed to place order.");
  }
};

  if (loading) return <div>Loading products...</div>;

  const filteredAll = filterProducts(allProducts);

  return (
    <div className="products-container">
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="search-containery">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {renderTable("Stocks", filteredAll)}

     <div className="buy-button-wrapper">
  <div className="buy-button-container">
    <button className="buy-button" onClick={() => setShowBuyModal(true)}>
      <FaShoppingCart size={18} /> {/* You can adjust the size */}
    </button>
  </div>
</div>

 {showBuyModal && (
  <div className="modal-overlay" onClick={() => setShowBuyModal(false)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h2>Place Order</h2>
      <table className="modal-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total (per product)</th>
            <th>Expiration</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((p) => {
            const selected = selectedProducts[p._id];
            const productTotal = selected
              ? (p.UNIT_PRICE * selected.quantitySold).toFixed(2)
              : "-";

            return (
              <tr key={p._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => handleCheckboxChange(p, p._id)}
                  />
                </td>
                <td>{p.PRODUCT_NAME}</td>
                <td>{p.BRAND}</td>
                <td>{p.UNIT_PRICE}</td>
                <td>
                  {selected ? (
                    <input
                      type="number"
                      min="1"
                      value={selected.quantitySold}
                      onChange={(e) =>
                        handleQuantityChange(p._id, e.target.value)
                      }
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>₱{productTotal}</td>
                <td>{formatDate(p.EXPIRATION_DATE)}</td>
                <td>{p.CATEGORY}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="modal-footer">
        <h3>Overall Total: ₱{totalAmount.toFixed(2)}</h3>
        <div className="modal-footer-buttons">
          <button onClick={handlePlaceOrder}>Place Order</button>
          <button onClick={() => setShowBuyModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}

      {stockWarning && (
  <div className="modal-overlay">
    <div className="modal">
      {stockWarning === "expired" ? (
        <>
          <h2>Expired Product Warning</h2>
          <p>
            Order cannot be completed because some selected products are expired.
            Check the expired products for details.
          </p>
        </>
      ) : (
        <>
          <h2>Stock Warning</h2>
          <p>
            Order cannot be completed because some products are out of stock or have insufficient stock.
            Check the low-stock products for details.
          </p>
        </>
      )}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button onClick={() => setStockWarning(null)}>OK</button>
      </div>
    </div>
  </div>
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


  function renderTable(title, list) {
    return (
      <div className="product-section">
        <h2>{title}</h2>
        {list.length === 0 ? (
          <p>No {title.toLowerCase()} found.</p>
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
              {list.map(p => (
                <tr key={p._id}>
                  <td>{p.PRODUCT_NAME}</td>
                  <td>{p.BRAND}</td>
                  <td>{p.UNIT_PRICE}</td>
                  <td>{p.QUANTITY}</td>
                  <td>{new Date(p.EXPIRATION_DATE).toLocaleDateString()}</td>
                  <td>{p.CATEGORY}</td>
                  <td>{new Date(p.TIMESTAMP).toLocaleString()}</td>
                  <td style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                    <button className="edit-button-product" onClick={() => handleEditClick(p)}>
                      <FaEdit />
                    </button>
                    <button
                      className="delete-button-producty"
                      onClick={() => handleDelete(p._id, p.PRODUCT_NAME)}
                    >
                      <Trash width={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
};

export default ProductPage;
