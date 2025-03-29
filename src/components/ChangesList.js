import React from 'react';

function ChangesList({ changes }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Balance Changes</h2>
      <div className="space-y-2">
        {changes.map((change, index) => (
          <div key={index} className="border p-2 rounded">
            <p>Time: {new Date(change.timestamp).toLocaleString()}</p>
            <p>Amount Changed: {change.amount}</p>
            <p>Previous Balance: {change.previousBalance}</p>
            <p>New Balance: {change.newBalance}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChangesList; 