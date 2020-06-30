import React from 'react';
import {primary, primary2, primary3, primary4} from './colors';
import {FaCog} from 'react-icons/fa';

const styles = {
  container: {
    backgroundColor: primary3,
    color: '#FFF',
    padding: 10,
    width: 150,
    fontFamily: 'MuseoModerno',
  },
  logo: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 10,
    fontFamily: 'MuseoModerno',
  },
  panelItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
  },
  settingsBlock: {
    marginTop: 200,
  },
  icon: {
    marginRight: 6,
  },
};

export function LeftPanel() {
  return (
    <div style={styles.container}>
      <div style={styles.logo}>Sailplane</div>
      <div style={styles.panelItem}>Files</div>

      <div style={styles.settingsBlock}>
        <div style={styles.panelItem}>
          <FaCog color={'#FFF'} size={15} style={styles.icon} />
          Settings
        </div>
      </div>
    </div>
  );
}
