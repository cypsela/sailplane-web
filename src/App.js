import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {LeftPanel} from './LeftPanel';
import {FileBlock} from './FileBlock';
import {useWindowSize} from './hooks/useWindowSize';
import useIPFS from './hooks/useIPFS';
import OrbitDB from 'orbit-db';
import Sailplane from '@cypsela/sailplane-node';
import {LoadingRightBlock} from './LoadingRightBlock';
import {useLocalStorage} from './hooks/useLocalStorage';

function App() {
  const windowSize = useWindowSize();
  const windowWidth = windowSize.width;
  const ipfsObj = useIPFS();
  const sharedFS = useRef({});
  const [ready, setReady] = useState(false);
  const [directoryContents, setDirectoryContents] = useState([]);
  const [instanceAddress, setInstanceAddress] = useLocalStorage(
    'instanceAddress',
    null,
  );

  console.log('instance', instanceAddress)

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: windowSize.height,
    },
  };

  const connectOrbit = async (ipfs) => {
    const orbitdb = await OrbitDB.createInstance(ipfs);
    const sailplane = await Sailplane.create(orbitdb, {});

    let address;
    if (instanceAddress) {
      address = instanceAddress;
    } else {
      address = await sailplane.determineAddress('superdrive');
      setInstanceAddress(address.toString());
    }

    sharedFS.current = await sailplane.mount(address, {});
    sharedFS.current.events.on('updated', () => {
      rootLS(true);
    });
    // console.log('adds', await ipfs.config.get('Addresses'));

    setReady(true);
  };

  // Connect orbit todo: make hook
  useEffect(() => {
    if (ipfsObj.isIpfsReady) {
      connectOrbit(ipfsObj.ipfs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipfsObj.ipfs, ipfsObj.isIpfsReady]);

  const rootLS = async (force) => {
    if (ready || force) {
      const res = await sharedFS.current.fs.ls('/r');

      let contents = [];

      for (let lsItem of res) {
        const type = sharedFS.current.fs.content(lsItem);

        contents.push({
          type,
          path: lsItem,
        });
      }

      setDirectoryContents(contents);
      console.log(contents);
    }
  };

  useEffect(() => {
    rootLS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div style={styles.container}>
      {windowWidth > 600 ? <LeftPanel /> : null}

      {ready ? (
        <FileBlock sharedFs={sharedFS} directoryContents={directoryContents} />
      ) : (
        <LoadingRightBlock />
      )}
    </div>
  );
}

export default App;
