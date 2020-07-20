import React, {useEffect, useState} from 'react';
import * as SailplaneAccess from './utils/sailplaneAccess';
import {primary3, primary45} from "./colors";

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
    display: 'flex',
    alignItems: 'center',
    color: primary45,

  },
  settingItemTitle: {
    marginRight: 6,
    fontSize: 14,
    color: primary3
  },
  input: {
    color: primary45,
    fontSize: 16,
    padding: 4,
    border: `1px solid ${primary45}`,
    width: 200,
    borderRadius: 4,
  },
};

export function Settings({sharedFS}) {
  const [myID, setMyID] = useState(null);

  useEffect(() => {
    const getPerms = async () => {
      const tmpMyID = await SailplaneAccess.localUserId(sharedFS.current);
      setMyID(tmpMyID);
    };

    getPerms();
  }, [sharedFS]);
  return (
    <div style={styles.container}>
      <div style={styles.settingItem}>
        <div style={styles.settingItemTitle}>My ID:</div>
        <div>
          {myID}
        </div>
      </div>
    </div>
  );
}
