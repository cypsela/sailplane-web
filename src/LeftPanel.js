import React from 'react';
import {primary4} from './colors';
import {FaTrash, FaCog} from 'react-icons/fa';
import {PanelItem} from './components/PanelItem';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: primary4,
    color: '#FFF',
    padding: 10,
    width: 150,
    fontFamily: 'Open Sans',
    paddingBottom: 0,
  },
  logo: {
    fontFamily: 'MuseoModerno',
    color: '#FFF',
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 10,
    textAlign: 'center',
  },
  settingsBlock: {
    bottom: 0,
    width: '100%',
  },
  icon: {
    marginRight: 4,
  },
};

export function LeftPanel() {
  return (
    <div style={styles.container}>
      <div>
        <div style={styles.logo}>Sailplane</div>
        <PanelItem title={'Files'} selected={true} />
        <PanelItem
          title={'Trash'}
          icon={<FaTrash color={'#FFF'} size={12} style={styles.icon} />}
          selected={false}
        />
      </div>

      <div style={styles.settingsBlock}>
        <PanelItem
          title={'Settings'}
          icon={<FaCog color={'#FFF'} size={15} style={styles.icon} />}
        />
      </div>
    </div>
  );
}
