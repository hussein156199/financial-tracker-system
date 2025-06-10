// src/pages/ShowItemsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterControls from '../components/FilterControls/FilterControls';
import './ShowItemsPage.css';

const ShowItemsPage = () => {
  const navigate = useNavigate();
  const [itemsState, setItemsState] = useState({
    items: [],
    filteredItems: [],
    isLoading: true,
    error: null
  });
  const [userInfo, setUserInfo] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    category: ''
  });

  const categories = ['All', 'food', 'Transport', 'Entertainment', 'Bills', 'test'];

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:3001/userinfo');
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setItemsState(prev => ({ ...prev, isLoading: true }));
        const response = await fetch('http://localhost:3001/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItemsState({
          items: data,
          filteredItems: data,
          isLoading: false,
          error: null
        });
      } catch (err) {
        setItemsState(prev => ({
          ...prev,
          isLoading: false,
          error: err.message
        }));
        console.error('Error fetching items:', err);
      }
    };

    fetchItems();
  }, []);

  // Handle date filter changes
  const handleDateChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type === 'from' ? 'fromDate' : 'toDate']: value
    }));
  };

  // Handle category filter changes
  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setFilters(prev => ({
      ...prev,
      category: selectedCategory
    }));

    try {
      setItemsState(prev => ({ ...prev, isLoading: true }));
      
      if (selectedCategory === 'All') {
        // Fetch all items if 'All' is selected
        const response = await fetch('http://localhost:3001/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItemsState({
          items: data,
          filteredItems: data,
          isLoading: false,
          error: null
        });
      } else {
        // Fetch items by category
        const response = await fetch(`http://localhost:3001/items/category/${selectedCategory}`);
        if (!response.ok) {
          throw new Error('Failed to fetch items by category');
        }
        const data = await response.json();
        setItemsState({
          items: data,
          filteredItems: data,
          isLoading: false,
          error: null
        });
      }
    } catch (err) {
      setItemsState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message
      }));
      console.error('Error fetching items:', err);
    }
  };

  // Apply filters to items
  const handleFilter = () => {
    let result = [...itemsState.items];
    
    if (filters.fromDate) {
      result = result.filter(item => new Date(item.date) >= new Date(filters.fromDate));
    }
    
    if (filters.toDate) {
      result = result.filter(item => new Date(item.date) <= new Date(filters.toDate));
    }
    
    if (filters.category && filters.category !== 'All') {
      result = result.filter(item => item.category === filters.category);
    }
    
    setItemsState(prev => ({
      ...prev,
      filteredItems: result
    }));
  };


  if (itemsState.isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (itemsState.error) {
    return <div className="error">Error: {itemsState.error}</div>;
  }

  return (
    <div className="show-items-container">
      <header className="page-header">
        <h1>Personal Tracker</h1>
        <div className="page-actions">
          <button 
            className="action-btn"
            onClick={() => navigate('/add-item')}
          >
            Add Item
          </button>
        </div>
      </header>

      <div className="budget-summary">
        {userInfo && (
          <div className="budget-info" style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <div className="total-budget" style={{ marginRight: '20px' }}>
              Total Budget = ${userInfo.total_budget.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <div className="total-payments" style={{ marginRight: '20px' }}>
              Total payments = ${userInfo.payments.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <div className="remaining-budget" style={{ marginRight: '20px' }}>
              Remaining budget = ${userInfo.remaining_budget.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        )}
      </div>

      <FilterControls
        onFilter={handleFilter}
        dateRange={{ from: filters.fromDate, to: filters.toDate }}
        onDateChange={handleDateChange}
        categories={categories}
        selectedCategory={filters.category}
        onCategoryChange={handleCategoryChange}
      />

      <div className="items-table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {itemsState.filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.category}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowItemsPage;