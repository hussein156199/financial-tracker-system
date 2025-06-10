import React from 'react';
import './HomePage.css';
import BannerSection from '../components/BannerSection/BannerSection';

const HomePage = () => {
  return (
    <div className="home-page">
      <BannerSection />
      
      {/* New About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>About Personal Finance Tracker</h2>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">💰</div>
              <h3>Track Spending</h3>
              <p>Monitor your expenses and income with our intuitive interface.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">📊</div>
              <h3>Visual Reports</h3>
              <p>Get clear insights with beautiful charts and analytics.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">🔒</div>
              <h3>Secure Data</h3>
              <p>Your financial data is always protected and private.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;