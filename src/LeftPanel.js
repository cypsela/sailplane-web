import React from 'react';
import {primary4} from './colors';
import {FaTrash, FaCog} from 'react-icons/fa';
import {PanelItem} from './components/PanelItem';

const styles = {
  container: {
    backgroundColor: primary4,
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
      <PanelItem title={'Files'} selected={true} />
      <PanelItem
        title={'Trash'}
        icon={<FaTrash color={'#FFF'} size={12} style={styles.icon} />}
        selected={false}
      />

      <div style={styles.settingsBlock}>
        <PanelItem
          title={'Settings'}
          icon={<FaCog color={'#FFF'} size={15} style={styles.icon} />}
        />
      </div>
    </div>
  );
}
