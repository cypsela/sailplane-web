import React, {useEffect, useState} from 'react';
import * as sailplaneAccess from './utils/sailplane-access';
import {primary3, primary45} from './colors';
import Jdenticon from 'react-jdenticon';

const styles = {
  container: {
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  settingItem: {
    lineHeight: '14px',
    display: 'flex',
    alignItems: 'center',
    color: primary45,
  },
  iconHolder: {
    marginRight: 4,
  }
};

export function Settings({sharedFS}) {
  const [myID, setMyID] = useState(null);

  useEffect(() => {
    const getPerms = async () => {
      const tmpMyID = await sailplaneAccess.localUserId(sharedFS.current);
      setMyID(tmpMyID);
    };

    getPerms();
  }, [sharedFS]);

  if (!myID) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.settingItem}>
        <div style={styles.iconHolder}>
          <Jdenticon value={myID} size={34}/>
        </div>

        <div>{myID}</div>
      </div>
    </div>
  );
}
