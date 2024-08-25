import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InputPage = () => {
  const [formData, setFormData] = useState({ from: '' });
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    fetchSuggestions(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.from) {
      alert('Please select a city.');
      return;
    }
    navigate('/result', { state: formData });
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) return;

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          countrycodes: 'IN', // Limit to India (optional)
          limit: 5,
        },
      });

      setFromSuggestions(response.data.map((place) => ({
        name: place.display_name,
        lat: place.lat,
        lon: place.lon,
      })));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      from: suggestion.name,
    }));
    setFromSuggestions([]);
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setFromSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: "url('B2.png')" }}
    >
      <div ref={containerRef} className="relative w-1/3">
        <form onSubmit={handleSubmit} className="p-6 backdrop-blur-sm bg-white/30 bg-opacity-80 rounded shadow-md">
          <div className="relative mb-4">
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="block w-full p-2 mb-4 border text-rose-100 border-gray-300 rounded"
              placeholder="Enter a city or location"
            />
            {fromSuggestions.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 list-none mt-1 p-2 w-full max-h-40 overflow-y-auto z-10">
                {fromSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputPage;
