import React, { useState, useEffect } from 'react';
import ChangeListItem from './ChangeListItem';
import styles from './ChangesList.module.css';

function ChangesList({ changes }) {
  
  const [recentId, setRecentId] = useState(0);
  useEffect(() => {
    setRecentId(changes?.[0]?.id);
  }, [changes]);

  if (!changes) return null;

  const data = changes.length > 5 ? changes.slice(0, changes.length-1) : changes;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Історія</h2>
      
      <div className={styles.changesList}>
        {data.map((change, index) => {
          const previousChange = index < changes.length - 1 ? changes[index + 1] : null;

          return (
            <ChangeListItem
              key={change.id}
              change={change}
              previousChange={previousChange}
              isNew={change.id === recentId}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ChangesList; 