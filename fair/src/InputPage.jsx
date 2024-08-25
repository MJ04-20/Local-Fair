import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InputPage = () => {
  const [formData, setFormData] = useState({ from: '' });
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.from) {
      alert('Please select a "From" city.');
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

  return (
    <div
      className={`flex items-center justify-center h-screen w-screen bg-cover bg-center transition-all duration-500`}
    >
      <form onSubmit={handleSubmit} className="p-6 w-1/2 backdrop-blur-sm bg-white/30 bg-opacity-80 rounded shadow-md">
        <div className='flex justify-center mb-4'>
          <label className="block mb-2">From:</label>
          <input
            type="text"
            name="from"
            value={formData.from}
            onChange={(e) => {
              handleChange(e);
              fetchSuggestions(e.target.value);
            }}
            className="block w-full p-2 mb-4 border border-gray-300 rounded"
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

        <div className='flex justify-center'>
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputPage;
