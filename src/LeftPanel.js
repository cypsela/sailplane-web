import React from 'react';
import {primary45} from './colors';
import {FaFolderOpen, FaCog, FaDatabase, FaPaperPlane} from 'react-icons/fa';
import {PanelItem} from './components/PanelItem';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: primary45,
    color: '#FFF',
    padding: '20px 10px',
    width: 200,
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    cursor: 'pointer',
  },
  settingsBlock: {
    bottom: 0,
    width: '100%',
  },
  icon: {
    marginRight: 6,
  },
};

export function LeftPanel({setCurrentRightPanel, currentRightPanel}) {
  return (
    <div style={styles.container}>
      <div>
        <div
          style={styles.logo}
          onClick={() => (document.location = `${window.location.origin}/`)}>
          <FaPaperPlane color={'#FFF'} size={18} style={styles.icon} />
          Sailplane
        </div>
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
