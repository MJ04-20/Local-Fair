import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InputPage = () => {
  const [formData, setFormData] = useState({ from: '', to: '', timeOfDay: 'Day' });
  const [isDay, setIsDay] = useState(true);
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
    navigate('/result', { state: formData });
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 w-1/2 bg-rose-500 rounded shadow-md">
        <label className="block mb-2">From:</label>
        <select
          name="from"
          value={formData.from}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="">From</option>
          <option value="City A">City A</option>
          <option value="City B">City B</option>
        </select>

        <label className="block mb-2">To:</label>
        <select
          name="to"
          value={formData.to}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="">To</option>
          <option value="City X">City X</option>
          <option value="City Y">City Y</option>
        </select>

        <label className="block mb-4">Time of Day:</label>
        <div className="relative inline-block w-16 h-8 mb-4">
          <input
            type="checkbox"
            id="toggle"
            className="hidden"
            checked={!isDay}
            onChange={toggleDayNight}
          />
          <label
            htmlFor="toggle"
            className={`block cursor-pointer bg-blue-500 rounded-full p-1 transition-colors duration-300 ease-in-out ${
              isDay ? 'bg-blue-500' : 'bg-purple-500'
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                isDay ? 'translate-x-0' : 'translate-x-8'
              }`}
            ></div>
          </label>
        </div>

        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InputPage;
