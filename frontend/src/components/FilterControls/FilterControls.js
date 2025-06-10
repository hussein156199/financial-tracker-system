// src/components/FilterControls/FilterControls.js
import React from 'react';
import './FilterControls.css';

const FilterControls = ({ 
  dateRange,
  onDateChange,
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="filter-controls">
      <div className="filter-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <label style={{ fontSize: '19px', fontWeight: 'bold', color: 'orange' }}>Classify With Category</label>
        <select
          value={selectedCategory}
          onChange={onCategoryChange}
          className="category-select"
          style={{ width: '75%' }}
        >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls;