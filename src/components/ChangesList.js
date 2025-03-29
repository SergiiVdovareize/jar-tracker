import React, { useState, useEffect } from 'react';
import ChangeListItem from './ChangeListItem';
import styles from './ChangesList.module.css';

function ChangesList({ changes }) {
  
  const [recentId, setRecentId] = useState(changes[0]?.id);
  useEffect(() => {
    console.log('changes')
    setRecentId(changes[0]?.id);
  }, [changes]);

  console.log(recentId)
  
  if (!changes) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Balance Changes</h2>
      <div className={styles.changesList}>
        {changes.map((change, index) => {
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