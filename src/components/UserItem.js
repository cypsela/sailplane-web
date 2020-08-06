import Jdenticon from 'react-jdenticon';
import React from 'react';
import {primary4, primary45} from "../utils/colors";

export default function UserItem({pubKey, myID}) {
  const styles = {
    userBlock: {
      color: primary4,
      fontSize: 18,
      fontFamily: 'Open Sans',
      lineHeight: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 6,
    },
    adminLeft: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    iconHolder: {
      marginRight: 8,
    },
    adminTitle: {
      fontSize: 12,
      lineHeight: '12px',
      textAlign: 'center',
      color: primary45,
      marginBottom: 3,
    },
    youText: {
      fontSize: 14,
    },
  };

  return (
    <div style={styles.userBlock}>
      <div style={styles.adminLeft}>
        <div style={styles.iconHolder}>
          <Jdenticon value={pubKey} size={34} style={styles.icon} />
        </div>
        <div style={styles.adminNameHolder}>
          <div style={styles.adminTitle}></div>
          <div>
            {pubKey.slice(0, 10)}{' '}
            {myID === pubKey ? <span style={styles.youText}>[You]</span> : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
