import React, { useState, useEffect } from 'react';

function BalanceInput({ onSubmit, isTracking, initialValue = '' }) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

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