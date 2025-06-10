import React, { useState, useEffect } from 'react';
import './BudgetCounter.css';

function BudgetCounter({ onBudgetUpdated }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

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
        console.log('BudgetCounter: Fetched user info:', data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAddBudget = async () => {
    const amount = parseFloat(inputValue);
    
    if (isNaN(amount)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (amount > 1000000) {
      setError('Amount cannot exceed $1,000,000');
      return;
    }

    try {
      console.log('BudgetCounter: Adding budget:', amount);
      const response = await fetch('http://localhost:3001/userinfo/budget', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ budget: amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to update budget');
      }

      const updatedUserInfo = await response.json();
      console.log('BudgetCounter: Updated user info:', updatedUserInfo);
      setUserInfo(updatedUserInfo);
      setInputValue('');
      setError('');
      
      // Notify parent component that budget was updated
      if (onBudgetUpdated) {
        console.log('BudgetCounter: Calling onBudgetUpdated');
        onBudgetUpdated();
      }
    } catch (err) {
      setError('Failed to update budget. Please try again.');
      console.error('Error updating budget:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddBudget();
    }
  };

  return (
    <div className="budget-counter">
      <div className="budget-display">
        <span className="budget-label">Remaining Budget:</span>
        <span className="budget-amount" style={{ color: 'green', fontSize: '25px', paddingBottom: '3px' }}>
          ${userInfo ? userInfo.remaining_budget.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) : '0.00'}
        </span>
      </div>
      
      <div className="budget-controls">
        <div className="input-group">
          <span className="currency-symbol" style={{ color: 'green', fontSize: '25px', paddingBottom: '3px', marginLeft: '3px' }}>$</span>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            className={error ? 'error-input' : ''}
            style={{ borderRadius: '15px', width: '93%' }}
          />
        </div>
        
        <button 
          onClick={handleAddBudget}
          disabled={!inputValue}
          className="add-button"
          style={{ borderRadius: '15px'}}
        >
          Add to Budget
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default BudgetCounter;