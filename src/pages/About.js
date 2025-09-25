import React from "react";
import "../styles/About.css"; // Make sure your About.css is styled nicely

const About = () => {
  return (
    <div className="about-container">
      <h1>Point Of Sale and Inventory Management System Maymed Pharmacy</h1>
      <p>
        The <strong>Point Of Sale and Inventory Management System Maymed Pharmacy</strong> is designed to streamline the daily operations of the pharmacy by providing 
        an easy-to-use and efficient platform for managing products, stocks, and sales. 
        This system allows the admin to easily navigate between different sections and 
        perform important tasks that ensure smooth business operations.
      </p>

      <h2>Key Features:</h2>
      <ul>
        <li>
          <strong>✅ Add Products and Stocks</strong>  
          <p>Easily add new products to the inventory and update stock levels whenever new stock arrives.</p>
        </li>
        <li>
          <strong>✅ Expired Product Management</strong>  
          <p>Monitor and manage expired products to ensure customer safety and compliance.</p>
        </li>
        <li>
          <strong>✅ Low Stock Alerts</strong>  
          <p>Get a list of products running low in stock, making restocking more efficient.</p>
        </li>
        <li>
          <strong>✅ Sales Tracking</strong>  
          <p>View products sold to monitor sales trends and make data-driven decisions.</p>
        </li>
        <li>
          <strong>✅ Cancelled Product Tracking</strong>  
          <p>Keep track of all cancelled sales for accountability and proper inventory updates.</p>
        </li>
        <li>
          <strong>✅ Active Product Management</strong>  
          <p>Manage all active products and update their availability when needed.</p>
        </li>
        <li>
          <strong>✅ Simple & Separate Navigation</strong>  
          <p>Each section (Products, Stocks, Sales, Cancellations) has its own page for easy access and a smooth admin experience.</p>
        </li>
        <li>
          <strong>✅ Efficient POS Functionality</strong>  
          <p>Facilitate quick and accurate product purchases with a reliable point of sale interface.</p>
        </li>
      </ul>

      <p>
        This system helps Norhaya Pharmacy maintain an organized inventory, 
        reduce errors in stock management, and improve customer service 
        by ensuring that products are always available and properly tracked.
      </p>
    </div>
  );
};

export default About;
