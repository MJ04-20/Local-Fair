import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ResultPage = () => {
  const location = useLocation();
  const { from, to, timeOfDay } = location.state || {};
  const mapRef = useRef(null); // useRef to hold map instance

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map only once
      mapRef.current = L.map('map', {
        center: [22.5726, 88.3639], // Default location: Kolkata, India
        zoom: 13,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }),
        ],
      });
    }

    // Return cleanup to remove the map if the component is unmounted
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Remove map when component is unmounted
        mapRef.current = null; // Clear reference to prevent duplicate initialization
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md mb-4">
        <h2 className="text-lg font-bold">Result</h2>
        <p>From: {from}</p>
        <p>To: {to}</p>
        <p>Time of Day: {timeOfDay}</p>
      </div>

      {/* Map Container */}
      <div id="map" className="w-full h-96"></div>
    </div>
  );
};

export default ResultPage;
