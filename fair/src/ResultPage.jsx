// ResultPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const { from, to, timeOfDay } = location.state || {};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-lg font-bold">Result</h2>
        <p>From: {from}</p>
        <p>To: {to}</p>
        <p>Time of Day: {timeOfDay}</p>
      </div>
    </div>
  );
};

export default ResultPage;
