import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import {LeftPanel} from './LeftPanel';
import {FileBlock} from './FileBlock';
import {useWindowSize} from './hooks/useWindowSize';
import useIPFS from './hooks/useIPFS';
import OrbitDB from 'orbit-db';
import Sailplane from '@cypsela/sailplane-node';
import {LoadingRightBlock} from './LoadingRightBlock';
import {useLocalStorage} from './hooks/useLocalStorage';
import {hot} from 'react-hot-loader';
import {Settings} from './Settings';

function App() {
  const windowSize = useWindowSize();
  const windowWidth = windowSize.width;
  const ipfsObj = useIPFS();
  const sharedFS = useRef({});
  const [ready, setReady] = useState(false);
  const [directoryContents, setDirectoryContents] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('/r');
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [currentRightPanel, setCurrentRightPanel] = useState('files');
  const [instanceAddresses, setInstanceAddresses] = useLocalStorage(
    'instanceAddresses',
    [],
  );
  const [instanceAddressIndex, setInstanceAddressIndex] = useLocalStorage(
    'instanceAddressIndex',
    0,
  );

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
    },
  };

  const rootLS = async () => {
    if (ready) {
      const res = await sharedFS.current.fs.ls(currentDirectory);

      let contents = [];

      for (let lsItem of res) {
        const type = sharedFS.current.fs.content(lsItem);
        const pathSplit = lsItem.split('/');
        const name = pathSplit[pathSplit.length - 1];

        contents.push({
          type,
          name,
          path: lsItem,
        });
      }

      setDirectoryContents(contents);
    }
  };

  useEffect(() => {
    rootLS();
  }, [ready, currentDirectory, lastUpdateTime]);

  const connectOrbit = useCallback(
    async (ipfs) => {
      const orbitdb = await OrbitDB.createInstance(ipfs);

      const sailplane = await Sailplane.create(orbitdb, {});
      let address;
      if (instanceAddresses.length) {
        address = instanceAddresses[instanceAddressIndex].address;
      } else {
        address = await sailplane.determineAddress('superdrive');
        setInstanceAddresses([{address: address.toString(), name: 'main'}]);
      }
      sharedFS.current = await sailplane.mount(address, {});

      sharedFS.current.events.on('updated', () => {
        setLastUpdateTime(Date.now());
      });

      // console.log('adds', await ipfs.config.get('Addresses'));

      setReady(true);
    },
    [instanceAddresses, setInstanceAddresses],
  );

  // Connect orbit todo: refactor hook
  useEffect(() => {
    if (ipfsObj.isIpfsReady && !ready) {
      connectOrbit(ipfsObj.ipfs);
    }
  }, [ipfsObj.ipfs, ipfsObj.isIpfsReady, ready, connectOrbit]);

  const getRightPanel = () => {
    if (currentRightPanel === 'files') {
      return (
        <FileBlock
          sharedFs={sharedFS}
          ipfs={ipfsObj.ipfs}
          directoryContents={directoryContents}
          setCurrentDirectory={setCurrentDirectory}
          currentDirectory={currentDirectory}
        />
      );
    } else if (currentRightPanel === 'settings') {
      return <Settings />;
    }
  };

  return (
    <div style={styles.container}>
      {windowWidth > 600 ? (
        <LeftPanel
          setCurrentRightPanel={setCurrentRightPanel}
          currentRightPanel={currentRightPanel}
        />
      ) : null}

      {ready ? getRightPanel() : <LoadingRightBlock />}
    </div>
  );
}

export default hot(module)(App);
