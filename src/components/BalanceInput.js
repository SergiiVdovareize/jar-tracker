import React, { useState } from 'react';

function BalanceInput({ onSubmit, isTracking }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter Balance ID"
        className="border p-2 rounded"
      />
      <button 
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isTracking ? 'Tracking...' : 'Start Tracking'}
      </button>
    </form>
  );
}

export default BalanceInput; 