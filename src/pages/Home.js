import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import '../styles/Home.css';

const Home = () => {
    const [dashboardCounts, setDashboardCounts] = useState({
        soldProductsCount: 0,
        lowStockCount: 0,
        expiredCount: 0,
        activeProductsCount: 0,
    });

    const [recentSoldGrouped, setRecentSoldGrouped] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchAndCountProducts();
    }, []);

    const fetchAndCountProducts = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            // Fetch all products
            const productsRes = await api.get('/products/admin', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const products = productsRes.data;

            // Fetch sold products
            const soldRes = await api.get('/productsold/admin', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const soldProducts = soldRes.data.filter(item => !item.CANCELLED);

            // Sold Products Count = sum of QUANTITY_SOLD
            const soldProductsCount = soldProducts.reduce((sum, p) => sum + (p.QUANTITY_SOLD || 0), 0);

            // Low stock: products with QUANTITY <= 5
            const lowStockCount = products.filter(p => p.QUANTITY <= 5).length;

            // Expired
            const expiredCount = products.filter(p => new Date(p.EXPIRATION_DATE) <= new Date()).length;

            // Active
            const activeProductsCount = products.filter(p => new Date(p.EXPIRATION_DATE) > new Date()).length;

            // Group sold products by TIMESTAMP
            const grouped = soldProducts.reduce((acc, item) => {
                const time = new Date(item.TIMESTAMP).toLocaleString();
                if (!acc[time]) acc[time] = [];
                acc[time].push(item);
                return acc;
            }, {});

            setDashboardCounts({
                soldProductsCount,
                lowStockCount,
                expiredCount,
                activeProductsCount,
            });

            setRecentSoldGrouped(grouped);

        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleNavigateToSoldProducts = () => navigate('/product-sold');
    const handleNavigateToLowStock = () => navigate('/low-stock-products');
    const handleNavigateToExpiredProducts = () => navigate('/expired-products');
    const handleNavigateToActiveProducts = () => navigate('/product-page');

    return (
        <div className="home-container">
            {/* Title */}
            <h2 className="dashboard-title">DASHBOARD</h2>

            {/* Two Column Layout */}
            <div className="dashboard-layout">

<div className="recent-sold">
  <h3>Recent Product Sales</h3>
  <div className="recent-sold-scroll">
    {Object.entries(recentSoldGrouped).map(([time, items], idx) => (
      <div key={idx} className="recent-table">
        <div className="sold-time">
          <h4>Date Sold: {time}</h4>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.PRODUCT_NAME}</td>
                <td>{item.QUANTITY_SOLD}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
</div>



                {/* Right: Dashboard Counts */}
<div className="counters-grid">
  <div className="counter-containery">
    <div className="counter-content"><h3>Sold Products</h3></div>
    <button onClick={handleNavigateToSoldProducts} className="count-button">
      {dashboardCounts.soldProductsCount}
    </button>
  </div>

  <div className="counter-containery">
    <div className="counter-content"><h3>Low Stock Products</h3></div>
    <button onClick={handleNavigateToLowStock} className="count-button">
      {dashboardCounts.lowStockCount}
    </button>
  </div>

  <div className="counter-containery">
    <div className="counter-content"><h3>Expired Products</h3></div>
    <button onClick={handleNavigateToExpiredProducts} className="count-button">
      {dashboardCounts.expiredCount}
    </button>
  </div>

  <div className="counter-containery">
    <div className="counter-content"><h3>Active Products</h3></div>
    <button onClick={handleNavigateToActiveProducts} className="count-button">
      {dashboardCounts.activeProductsCount}
    </button>
  </div>
</div>

            </div>
        </div>
    );
};

export default Home;
