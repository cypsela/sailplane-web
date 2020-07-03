import React from 'react';
import {primary45} from './colors';
import {FaFolderOpen, FaCog, FaDatabase} from 'react-icons/fa';
import {PanelItem} from './components/PanelItem';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: primary45,
    color: '#FFF',
    padding: '20px 40px',
    width: 150,
    fontFamily: 'Open Sans',
    paddingBottom: 0,
  },
  logo: {
    fontFamily: 'MuseoModerno',
    color: '#FFF',
    fontSize: 24,
    fontWeight: 500,
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
          title={'Files'}
          iconComponent={FaFolderOpen}
          selected={currentRightPanel === 'files'}
          onClick={() => setCurrentRightPanel('files')}
        />
        <PanelItem
          title={'Instances'}
          iconComponent={FaDatabase}
          selected={currentRightPanel === 'instances'}
          onClick={() => setCurrentRightPanel('instances')}
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
