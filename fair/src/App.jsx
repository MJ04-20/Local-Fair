// App.jsx
import React from "react";
import InputPage from "./InputPage.jsx"; // Example of using your components

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Map1 from "./Map1.jsx";
import Layout from "./Layout.jsx";
import About from "./About.jsx";
import Contact  from "./Contact.jsx";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<InputPage />} />
          <Route path="/result" element={<Map1 />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
