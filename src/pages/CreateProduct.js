import React, { useState } from 'react';
import api from "../api"; 
import { FaBoxOpen } from 'react-icons/fa'; // Product icon
import '../styles/CreateProduct.css';

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    PRODUCT_NAME: '',
    BRAND: '',
    UNIT_PRICE: '',
    QUANTITY: '',
    EXPIRATION_DATE: '',
    CATEGORY: 'Medicines', // default
  });

  const [customCategory, setCustomCategory] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'Medicine',
    'Health & Personal Care',
    'Beauty & Cosmetic',
    'Miscellaneous',
    'Others',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'CATEGORY') {
      setProductData({ ...productData, CATEGORY: value });
      if (value !== 'Others') setCustomCategory('');
      setDropdownOpen(false);
    } else if (name === 'CUSTOM_CATEGORY') {
      setCustomCategory(value);
      setProductData({ ...productData, CATEGORY: value });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('You are not authenticated. Please log in.');
      return;
    }

    try {
      const response = await api.post(
        '/products',
        { ...productData }, // ✅ no USER_ID here
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Product created successfully: ${response.data.PRODUCT_NAME}`);
      setProductData({
        PRODUCT_NAME: '',
        BRAND: '',
        UNIT_PRICE: '',
        QUANTITY: '',
        EXPIRATION_DATE: '',
        CATEGORY: 'Medicines',
      });
      setCustomCategory('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product');
    }
  };

  return (
    <div className="create-product-container">
      <div className="product-header-row">
        <FaBoxOpen className="product-iconic" size={60} />
        <h1>Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-product-form p">
        {/* Product Name */}
        <div className="form-group p">
          <label htmlFor="PRODUCT_NAME">Product Name</label>
          <input
            type="text"
            id="PRODUCT_NAME"
            name="PRODUCT_NAME"
            value={productData.PRODUCT_NAME}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Brand */}
        <div className="form-group p">
          <label htmlFor="BRAND">Brand</label>
          <input
            type="text"
            id="BRAND"
            name="BRAND"
            value={productData.BRAND}
            onChange={handleChange}
            placeholder="Enter brand"
            required
          />
        </div>

        {/* Unit Price */}
        <div className="form-group p">
          <label htmlFor="UNIT_PRICE">Unit Price</label>
          <input
            type="number"
            step="0.01"
            id="UNIT_PRICE"
            name="UNIT_PRICE"
            value={productData.UNIT_PRICE}
            onChange={handleChange}
            placeholder="Enter unit price"
            required
          />
        </div>

        {/* Quantity */}
        <div className="form-group p">
          <label htmlFor="QUANTITY">Quantity</label>
          <input
            type="number"
            id="QUANTITY"
            name="QUANTITY"
            value={productData.QUANTITY}
            onChange={handleChange}
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Expiration Date */}
        <div className="form-group p">
          <label htmlFor="EXPIRATION_DATE">Expiration Date</label>
          <input
            type="date"
            id="EXPIRATION_DATE"
            name="EXPIRATION_DATE"
            value={productData.EXPIRATION_DATE}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group p">
          <label htmlFor="CATEGORY">Category</label>
          <div className="category-input-wrapper">
            <span
              className="category-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              📂
            </span>

            <input
              type="text"
              name="CUSTOM_CATEGORY"
              value={
                productData.CATEGORY === 'Others' ? customCategory : productData.CATEGORY
              }
              onChange={handleChange}
              placeholder="Select or enter category"
              className="category-input"
              required
              readOnly={productData.CATEGORY !== 'Others'}
            />

            {dropdownOpen && (
              <div className="category-select-dropdown">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="category-option"
                    onClick={() => {
                      setProductData({ ...productData, CATEGORY: cat });
                      if (cat !== 'Others') setCustomCategory(cat);
                      else setCustomCategory('');
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

        <button type="submit" className="submit-button p">
          OK
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateProduct;
