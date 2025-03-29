import React from 'react';
import { formatDate, formatBalance } from '../services/dataFormatter';

function ChangesList({ changes }) {
  const calculateChange = (current, previous) => {
    if (!previous) return null;
    const diff = current - previous;
    return {
      amount: diff,
      isPositive: diff > 0
    };
  };

  if (!changes) return null;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Balance Changes</h2>
      <div className="space-y-4">
        {changes.map((change, index) => {
          const previousChange = index < changes.length - 1 ? changes[index + 1] : null;
          const changeInfo = calculateChange(change.balance, previousChange?.balance);

          return (
            <div key={change.id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {formatDate(change.trackedAt)}
                  </p>
                  <p className="text-lg font-semibold mt-1">
                    {formatBalance(change.balance)}
                  </p>
                </div>
                {changeInfo && (
                  <div className={`text-sm ${changeInfo.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <p>{formatBalance(changeInfo.amount)}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChangesList; 