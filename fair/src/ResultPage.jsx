
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ResultPage = () => {
  const location = useLocation();
  const { from, to, timeOfDay } = location.state || {};
  const mapRef = useRef(null);

  useEffect(() => {
    if (!from || !to) return; // Exit early if required data is not available

    if (mapRef.current) {
      // If mapRef.current already exists, don't initialize it again
      return;
    }

    // Initialize the map
    const mapInstance = L.map('map', {
      center: [22.5726, 88.3639], // Default location: Kolkata, India
      zoom: 13,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    });

    mapRef.current = mapInstance; // Store the map instance

    // Add markers for 'from' and 'to' locations
    if (from.lat && from.lng) {
      L.marker([from.lat, from.lng]).addTo(mapInstance)
        .bindPopup(`<b>From:</b> ${from.name}`).openPopup();
    }

    if (to.lat && to.lng) {
      L.marker([to.lat, to.lng]).addTo(mapInstance)
        .bindPopup(`<b>To:</b> ${to.name}`).openPopup();
    }

    // Fit the map to show both markers
    const bounds = L.latLngBounds([from.lat, from.lng], [to.lat, to.lng]);
    mapInstance.fitBounds(bounds);

    // Cleanup to remove the map if the component is unmounted
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [from, to]); // Dependency array includes 'from' and 'to' to re-run effect when these change

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md mb-4">
        <h2 className="text-lg font-bold">Result</h2>
        <p>From: {from?.name || 'Unknown'}</p>
        <p>To: {to?.name || 'Unknown'}</p>
        <p>Time of Day: {timeOfDay}</p>
      </div>

      {/* Map Container */}
      <div id="map" className="w-full h-96"></div>
    </div>
  );
};

export default ResultPage;

