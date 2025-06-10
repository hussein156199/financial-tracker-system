import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BudgetCounter from '../components/BudgetCounter/BudgetCounter';
import AddItemForm from '../components/AddItemForm/AddItemForm';
import ItemCounter from '../components/ItemCounter/ItemCounter';
import './AddItemPage.css';

function AddItemPage() {
  const [items, setItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budget, setBudget] = useState(() => {
    // Initialize budget from localStorage or default to 1000
    const savedBudget = localStorage.getItem('budget');
    return savedBudget ? parseFloat(savedBudget) : 1000;
  });
  const navigate = useNavigate();

  // Save budget to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budget', budget.toString());
  }, [budget]);

  const fetchUserInfo = async () => {
    try {
      console.log('AddItemPage: Fetching user info...');
      const response = await fetch('http://localhost:3001/userinfo');
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();
      console.log('AddItemPage: Fetched user info:', data);
      setUserInfo(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load user information');
      setLoading(false);
      console.error('Error fetching user info:', err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleBudgetUpdated = () => {
    console.log('AddItemPage: Budget updated, refreshing user info');
    fetchUserInfo();
  };

  const handleItemAdded = () => {
    console.log('AddItemPage: Item added, refreshing user info');
    fetchUserInfo();
  };

  const handleClearDatabase = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:3001/clear', {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to clear database');
        }

        // Clear local storage
        localStorage.removeItem('financeItems');
        
        // Refresh the page to start fresh
        window.location.reload();
      } catch (err) {
        setError('Failed to clear database');
        console.error('Error clearing database:', err);
      }
    }
  };

  const handleAddItem = (newItem) => {
    const itemCost = parseFloat(newItem.price) * parseInt(newItem.quantity);
    const newItems = [...items, newItem];
    setItems(newItems);
    setTotalSpent(prev => prev + itemCost);
    
    // Save items to localStorage
    localStorage.setItem('financeItems', JSON.stringify(newItems));
  };

  const handleUpdateBudget = (amount) => {
    setBudget(prev => prev + amount);
  };

  const handleResetBudget = () => {
    if (window.confirm('Are you sure you want to reset your budget ?')) {
      setBudget(0);
      setTotalSpent(0);
      setItems([]);
      localStorage.removeItem('financeItems');
    }
  };
  

  // Load saved items on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('financeItems');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      setItems(parsedItems);
      
      // Calculate total spent from saved items
      const calculatedTotal = parsedItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * parseInt(item.quantity));
      }, 0);
      setTotalSpent(calculatedTotal);
    }
  }, []);


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="add-item-page">
      <header className="page-header">
        <h1>Personal Finance Tracker</h1>
        <div className="page-actions">
          <button 
            className="action-btn"
            onClick={() => navigate('/show-items')}
          >
            Show Items
          </button>
          <button 
            className="action-btn clear-btn"
            onClick={handleClearDatabase}
          >
            Clear All Data
          </button>
        </div>
      </header>
      
      <BudgetCounter 
        currentBudget={budget}
        onUpdateBudget={handleUpdateBudget} 
        onBudgetUpdated={handleBudgetUpdated}
      />
      
      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Total Budget</span>
          <div className="total-budget" style={{fontSize: '25px'}}>
            ${userInfo.total_budget.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Spent</span>
          <div className="total-spent" style={{ color: 'red', fontSize: '25px', paddingInline: '20px', paddingTop: '10px', paddingBottom: '10px', border: '2px solid red', borderRadius: '10px' }}>
            ${userInfo.payments.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-label">Remaining Budget</span>
          <div className={`remaining-budget ${
            userInfo.remaining_budget < 0 ? 'negative' : 
            userInfo.remaining_budget < userInfo.total_budget * 0.2 ? 'warning' : ''
          }` } style={{ fontSize: '25px' }}>
            ${userInfo.remaining_budget.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
        </div>
      </div>
      
      <AddItemForm onAddItem={handleItemAdded} />
    </div>
  );
}

export default AddItemPage;