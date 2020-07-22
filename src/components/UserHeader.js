import React, {useEffect, useState} from 'react';
import * as sailplaneAccess from '../utils/sailplane-access';
import Jdenticon from 'react-jdenticon';
import {primary45} from '../colors';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  right: {
    fontSize: 16,
    lineHeight: '18px',
    color: primary45,
  },
  userItem: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 2,
  },
};

export function UserHeader({sharedFS}) {
  const [myID, setMyID] = useState(null);

  useEffect(() => {
    const getID = async () => {
      const tmpMyID = await sailplaneAccess.localUserId(sharedFS.current);
      setMyID(tmpMyID);
    };

    getID();
  }, [sharedFS]);

  return (
    <div style={styles.container}>
      <div></div>
      <div style={styles.right}>
        {myID ? (
          <div style={styles.userItem}>
            <div>{myID.slice(0, 6)}</div>
            <Jdenticon value={myID} size={34} style={styles.icon} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
