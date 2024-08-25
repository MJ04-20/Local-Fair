import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon not displaying
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon1 - lon2) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const ResultPage = () => {
  const location = useLocation();
  const { from, to, timeOfDay } = location.state || {};

  const [locations, setLocations] = useState([]);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async (city, index) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
          setLocations((prevLocations) => [
            ...prevLocations,
            { name: city, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
          ]);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    if (from) fetchCoordinates(from, 0);
    if (to) fetchCoordinates(to, 1);
  }, [from, to]);

  useEffect(() => {
    if (locations.length === 2) {
      const dist = haversineDistance(locations[0].lat, locations[0].lng, locations[1].lat, locations[1].lng);
      setDistance(dist.toFixed(2));
    }
  }, [locations]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-lg font-bold">Result</h2>
        <p>From: {from}</p>
        <p>To: {to}</p>
        <p>Time of Day: {timeOfDay}</p>
        {distance && (
          <p className="mt-4">
            Distance between {from} and {to}: <strong>{distance} km</strong>
          </p>
        )}

        {locations.length === 2 && (
          <MapContainer
            center={[locations[0].lat, locations[0].lng]}
            zoom={5}
            scrollWheelZoom={true}
            className="h-96 w-full mt-4"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((location, index) => (
              <Marker key={index} position={[location.lat, location.lng]}>
                <Tooltip>{location.name}</Tooltip>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
