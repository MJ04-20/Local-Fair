// InputPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InputPage = () => {
  const [formData, setFormData] = useState({ from: '', to: '', timeOfDay: 'Day' });
  const [isDay, setIsDay] = useState(true);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDayNight = () => {
    setIsDay(!isDay);
    setFormData((prevFormData) => ({
      ...prevFormData,
      timeOfDay: isDay ? 'Night' : 'Day',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.from || !formData.to) {
      alert('Please select both "From" and "To" cities.');
      return;
    }
    navigate('/result', { state: formData });
  };

  const fetchSuggestions = async (query, setSuggestions) => {
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

      setSuggestions(response.data.map((place) => ({
        name: place.display_name,
        lat: place.lat,
        lon: place.lon,
      })));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelectSuggestion = (field, suggestion) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: suggestion.name,
    }));

    if (field === 'from') {
      setFromSuggestions([]);
    } else {
      setToSuggestions([]);
    }
  };

  return (
    <div
      className={`flex items-center justify-center h-screen w-screen bg-cover bg-center transition-all duration-500 ${
        isDay ? 'bg-[url("/B1.png")]' : 'bg-[url("/B2.png")]'
      }`}
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
              fetchSuggestions(e.target.value, setFromSuggestions);
            }}
            className="block w-full p-2 mb-4 border border-gray-300 rounded"
            placeholder="Enter a city or location"
          />
          {fromSuggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 list-none mt-1 p-2 w-full max-h-40 overflow-y-auto z-10">
              {fromSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion('from', suggestion)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex justify-center mb-4'>
          <label className="block mb-2">To:</label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={(e) => {
              handleChange(e);
              fetchSuggestions(e.target.value, setToSuggestions);
            }}
            className="block w-full p-2 mb-4 border border-gray-300 rounded"
            placeholder="Enter a city or location"
          />
          {toSuggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 list-none mt-1 p-2 w-full max-h-40 overflow-y-auto z-10">
              {toSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion('to', suggestion)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex justify-center mb-4'>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              id="toggle"
              className="sr-only"
              checked={!isDay}
              onChange={toggleDayNight}
              aria-label="Toggle between Day and Night"
            />
            <label
              htmlFor="toggle"
              className={`flex items-center cursor-pointer w-20 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${
                isDay ? 'bg-blue-500' : 'bg-purple-500'
              }`}
            >
              <span
                className={`absolute left-2 text-[#d46c17] text-sm font-semibold transition-opacity duration-300 ${
                  isDay ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Day
              </span>
              <span
                className={`absolute right-2 text-black text-sm font-semibold transition-opacity duration-300 ${
                  isDay ? 'opacity-0' : 'opacity-100'
                }`}
              >
                Night
              </span>
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                  isDay ? 'translate-x-0' : 'translate-x-12'
                }`}
              ></div>
            </label>
          </div>
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
