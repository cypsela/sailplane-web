import React from 'react';
import {
  primary,
  primary3,
  primary4,
  primary45,
  primary5,
  primary6,
} from './colors';
import {FaFolderOpen, FaCog, FaDatabase} from 'react-icons/fa';
import {FiDatabase} from 'react-icons/fi';
import {PanelItem} from './components/PanelItem';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: primary45,
    color: '#FFF',
    padding: "20px 40px",
    width: 150,
    fontFamily: 'Open Sans',
    paddingBottom: 0,
  },
  logo: {
    fontFamily: 'MuseoModerno',
    color: '#FFF',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
    textAlign: 'center',
  },
  settingsBlock: {
    bottom: 0,
    width: '100%',
  },
};

export function LeftPanel({setCurrentRightPanel, currentRightPanel}) {
  return (
    <div style={styles.container}>
      <div>
        <div style={styles.logo}>Sailplane</div>
        <PanelItem
          title={'Instances'}
          iconComponent={FaDatabase}
          selected={currentRightPanel === 'instances'}
          onClick={() => setCurrentRightPanel('instances')}
        />
        <PanelItem
          title={'Files'}
          iconComponent={FaFolderOpen}
          selected={currentRightPanel === 'files'}
          onClick={() => setCurrentRightPanel('files')}
        />
      </div>

      <div style={styles.settingsBlock}>
        <PanelItem
          title={'Settings'}
          selected={currentRightPanel === 'settings'}
          onClick={() => setCurrentRightPanel('settings')}
          iconComponent={FaCog}
        />
      </div>
    </div>
  );
}
