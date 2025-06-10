import React from 'react';
import './ItemCounter.css';

function ItemCounter({ count }) {
  return (
    <div className="item-counter">
      <span>Counter = {count}</span>
    </div>
  );
}

export default ItemCounter;