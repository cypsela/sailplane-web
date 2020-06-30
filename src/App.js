import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {LeftPanel} from './LeftPanel';
import {FileBlock} from './FileBlock';
import {useWindowSize} from './hooks/useWindowSize';
import useIPFS from './hooks/useIPFS';
import OrbitDB from 'orbit-db';
import Sailplane from '@cypsela/sailplane-node';
import {LoadingRightBlock} from './LoadingRightBlock';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
};

function App() {
  const windowSize = useWindowSize();
  const windowWidth = windowSize.width;
  const ipfsObj = useIPFS();
  const sharedFS = useRef({});
  const [ready, setReady] = useState(false);

  async function connectOrbit(ipfs) {
    const orbitdb = await OrbitDB.createInstance(ipfs);
    const sailplane = await Sailplane.create(orbitdb, {});
    const address = await sailplane.determineAddress('superdrive', {});
    sharedFS.current = await sailplane.mount(address, {});
    setReady(true);
  }

  // Connect orbit todo: make hook
  useEffect(() => {
    if (ipfsObj.isIpfsReady) {
      connectOrbit(ipfsObj.ipfs);
    }
  }, [ipfsObj.ipfs, ipfsObj.isIpfsReady]);

  async function rootLS() {
    if (ready) {
      const res = await sharedFS.current.fs.ls('/');
      console.log('res', res);
    }
  }

  useEffect(() => {
    rootLS();
  }, [ready]);

  return (
    <div style={styles.container}>
      {windowWidth > 600 ? <LeftPanel /> : null}

      {ready ? <FileBlock /> : <LoadingRightBlock/>}
    </div>
  );
}

export default App;
