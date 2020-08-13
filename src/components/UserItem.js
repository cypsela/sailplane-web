import Jdenticon from 'react-jdenticon';
import React from 'react';
import {primary4, primary45} from '../utils/colors';
import {useSelector} from 'react-redux';

export default function UserItem({pubKey, myID}) {
  const contacts = useSelector((state) => state.main.contacts);
  const matchingContact = contacts?.find(
    (contact) => contact.pubKey === pubKey,
  );

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
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.userBlock}>
      <div style={styles.adminLeft}>
        <div style={styles.iconHolder}>
          <Jdenticon value={pubKey} size={'34'} style={styles.icon} />
        </div>
        <div style={styles.adminNameHolder}>
          <div>
            {pubKey.slice(0, 10)}{' '}
            {myID === pubKey ? <span style={styles.youText}>[You]</span> : ''}
            {matchingContact?.label ? (
              <span style={styles.youText}>[{matchingContact.label}]</span>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
