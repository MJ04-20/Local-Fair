// App.jsx
import React from 'react';
import InputPage from './InputPage';  // Example of using your components

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Map1 from './Map1.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<InputPage />} />
        <Route path="/result" element={<Map1 />} />
      </Routes>
    </Router>
  );
};

export default App;
