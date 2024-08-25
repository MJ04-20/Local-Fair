// App.jsx
import React from 'react';
import InputPage from './InputPage.jsx';  // Example of using your components

import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Map1 from './Map1.jsx';
import Layout from './Layout.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<Layout/>} >
        <Route path="" element={<InputPage/>} />
        <Route path="/result" element={<Map1 />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
