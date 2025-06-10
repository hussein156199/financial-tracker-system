import React, { useState } from 'react';
import './AddItemForm.css';

function AddItemForm({ onAddItem }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: 1,
    category: 'Food'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Item name is required');
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.quantity || formData.quantity < 1) {
      setError('Please enter a valid quantity');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const itemData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category
      };

      const response = await fetch('http://localhost:3001/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }

      const newItem = await response.json();
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        quantity: 1,
        category: 'Food'
      });

      // Notify parent that item was added
      if (onAddItem) {
        onAddItem();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-form-container">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-group">
          <label htmlFor="name">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter item name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <div className="input-with-symbol">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            placeholder="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}

export default AddItemForm;