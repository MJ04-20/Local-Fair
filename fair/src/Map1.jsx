import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Tooltip, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';

// Fix for default icon not displaying
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Haversine formula to calculate distance
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon1 - lon2) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // Distance in kilometers
};

const Map1 = () => {
  const [locations, setLocations] = useState([
    { name: '', lat: null, lng: null, suggestions: [] },
    { name: '', lat: null, lng: null, suggestions: [] },
  ]);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [indiaGeoJson, setIndiaGeoJson] = useState(null);

  // Fetch India GeoJSON data
  useEffect(() => {
    const fetchIndiaGeoJson = async () => {
      try {
        const response = await axios.get('URL_TO_INDIA_GEOJSON'); // Replace with actual URL to GeoJSON file
        setIndiaGeoJson(response.data);
      } catch (error) {
        console.error('Error fetching India GeoJSON:', error);
      }
    };

    fetchIndiaGeoJson();
  }, []);

  const handleLocationChange = async (index, value) => {
    const newLocations = [...locations];
    newLocations[index].name = value;

    // Define the bounding box for India
    const bounds = {
      south: 6.5546079,
      west: 68.1113787,
      north: 35.6745457,
      east: 97.395561,
    };

    // Fetch suggestions in English only and within the bounding box
    if (value.length > 2) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: value,
            format: 'json',
            addressdetails: 1,
            bounded: 1, // Ensure results are within the bounding box
            countrycodes: 'IN', // Limit to India
            limit: 5,
            viewbox: `${bounds.west},${bounds.north},${bounds.east},${bounds.south}`, // Bounding box
            extratags: 1,
          },
          headers: {
            'Accept-Language': 'en', // Force English language results
          },
        });

        newLocations[index].suggestions = response.data
          .filter((item) => {
            const locationType = item.type;
            return (
              locationType === 'administrative' ||
              locationType === 'city' ||
              locationType === 'town' ||
              locationType === 'village'
            );
          })
          .map((item) => ({
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }));
      } catch (error) {
        setError(`Error fetching suggestions: ${error.message}`);
      }
    } else {
      newLocations[index].suggestions = [];
    }

    setLocations(newLocations);
  };

  const selectSuggestion = (index, suggestion) => {
    const newLocations = [...locations];
    newLocations[index] = {
      ...newLocations[index],
      name: suggestion.displayName,
      lat: suggestion.lat,
      lng: suggestion.lng,
      suggestions: [], // Clear suggestions after selection
    };
    setLocations(newLocations);
  };

  // Calculate straight-line distance using Haversine formula
  const calculateDistance = () => {
    if (locations[0].lat && locations[0].lng && locations[1].lat && locations[1].lng) {
      const dist = haversineDistance(
        locations[0].lat,
        locations[0].lng,
        locations[1].lat,
        locations[1].lng
      );
      setDistance(dist.toFixed(2));
      setError(null);
    } else {
      setError('Please select valid locations.');
    }
  };

  const SetMarkers = () => {
    const map = useMap();

    useEffect(() => {
      // Remove existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add new markers
      locations.forEach((location) => {
        if (location.lat && location.lng) {
          const marker = L.marker([location.lat, location.lng]).addTo(map);
          marker.bindTooltip(location.name, { permanent: true, direction: 'top' }).openTooltip();
        }
      });

      // Center the map on the first location if available
      if (locations[0].lat && locations[0].lng) {
        map.setView([locations[0].lat, locations[0].lng], 5);
      }
    }, [locations]);

    return null;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Enter Location Names (India)</h2>
        {locations.map((location, index) => (
          <div key={index} className="relative mb-4">
            <input
              type="text"
              placeholder="Location Name"
              value={location.name}
              onChange={(e) => handleLocationChange(index, e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            {location.suggestions.length > 0 && (
              <ul
                className="absolute bg-white border border-gray-300 list-none mt-1 p-2 w-full max-h-40 overflow-y-auto z-10"
              >
                {location.suggestions.map((suggestion, sIndex) => (
                  <li
                    key={sIndex}
                    onClick={() => selectSuggestion(index, suggestion)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.displayName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <button onClick={calculateDistance} className="bg-blue-500 text-white p-2 rounded">
          Calculate Distance
        </button>
        {distance && (
          <p className="mt-4">
            Distance between locations: <strong>{distance} km</strong>
          </p>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>

      {/* Render the map centered on India */}
      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-96 w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SetMarkers />
        {indiaGeoJson && <GeoJSON data={indiaGeoJson} />}
      </MapContainer>
    </div>
  );
};

export default Map1;
