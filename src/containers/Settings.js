import React from 'react';
import {primary45} from '../utils/colors';
import {UserHeader} from '../components/UserHeader';
import {FaCog} from 'react-icons/fa';

const styles = {
  container: {
    padding: 10,
    paddingTop: 6,
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
};

export function Settings({sharedFS}) {
  return (
    <div style={styles.container}>
      <UserHeader
        sharedFS={sharedFS}
        title={'Settings'}
        iconComponent={FaCog}
      />
    </div>
  );
}
