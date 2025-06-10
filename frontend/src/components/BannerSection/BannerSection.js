import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BannerSection.css';
import financeBg from '../../assests/finance-bg.webp';

function BannerSection() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // You could add any pre-navigation logic here
    console.log('Navigating to Add Item page');
    navigate('/add-item');
  };

  return (
    <div className="banner-container" style={{ backgroundImage: `url(${financeBg})` }}>
      <div className="banner-content">
        <h1>Welcome To Your</h1>
        <h1 className="highlight">Personal Finance Tracker!</h1>
        <p className="subtitle">Take control of your finances with our easy-to-use tracking system</p>
        
        <button 
          className="get-started-btn"
          onClick={handleGetStarted}
          aria-label="Get started with Personal Finance Tracker"
        >
          Get Started
        </button>
        
      </div>
    </div>
  );
}

export default BannerSection;