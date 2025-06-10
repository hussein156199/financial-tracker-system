// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddItemPage from './pages/AddItemPage';
import ShowItemsPage from './pages/ShowItemsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-item" element={<AddItemPage />} />
          <Route path="/show-items" element={<ShowItemsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;