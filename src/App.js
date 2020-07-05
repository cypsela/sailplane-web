import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import {LeftPanel} from './LeftPanel';
import {FileBlock} from './FileBlock';
import {useWindowSize} from './hooks/useWindowSize';
import useIPFS from './hooks/useIPFS';
import OrbitDB from 'orbit-db';
import Sailplane from '@cypsela/sailplane-node';
import {LoadingRightBlock} from './LoadingRightBlock';
import {hot} from 'react-hot-loader';
import {Settings} from './Settings';
import {Instances} from './Instances';
import {useDispatch, useSelector} from 'react-redux';
import {addInstance} from './actions/main';
import {setStatus} from './actions/tempData';

function App() {
  const windowSize = useWindowSize();
  const windowWidth = windowSize.width;
  const ipfsObj = useIPFS();
  const sharedFS = useRef({});
  const sailplaneRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [directoryContents, setDirectoryContents] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('/r');
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [currentRightPanel, setCurrentRightPanel] = useState('files');

  const dispatch = useDispatch();
  const main = useSelector((state) => state.main);
  const {instances, instanceIndex} = main;
  const currentInstance = instances[instanceIndex];

  const styles = {
    container: {
      position: 'relative',
      display: windowWidth>600?'flex':'block',
      flexDirection: 'row',
      height: '100%',
    },
  };

  const rootLS = async () => {
    if (ready) {
      dispatch(setStatus({message: 'Getting folder'}));
      const res = await sharedFS.current.fs.ls(currentDirectory);
      dispatch(setStatus({}));

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
    async (ipfs, doLS) => {
      dispatch(setStatus({message: 'Initializing'}));
      const orbitdb = await OrbitDB.createInstance(ipfs);

      const sailplane = await Sailplane.create(orbitdb, {});
      let address;
      if (instances.length) {
        address = currentInstance.address;
      } else {
        address = await sailplane.determineAddress('main', {
          meta: 'superdrive',
        });
        dispatch(addInstance(address.path, address.toString()));
      }
      sharedFS.current = await sailplane.mount(address, {});

      sharedFS.current.events.on('updated', () => {
        setLastUpdateTime(Date.now());
      });

      sailplaneRef.current = sailplane;
      // console.log('adds', await ipfs.config.get('Addresses'));

      if (doLS) {
        setCurrentDirectory('/r');
        setLastUpdateTime(Date.now());
      } else {
        setReady(true);
      }
      dispatch(setStatus({}));
    },
    [instances, instanceIndex],
  );

  // Connect orbit todo: refactor hook
  useEffect(() => {
    if (ipfsObj.isIpfsReady && !ready) {
      connectOrbit(ipfsObj.ipfs);
    }
  }, [ipfsObj.ipfs, ipfsObj.isIpfsReady, ready, connectOrbit]);

  useEffect(() => {
    if (ipfsObj.isIpfsReady && ready) {
      connectOrbit(ipfsObj.ipfs, true);
    }
  }, [instanceIndex, ready, instances]);

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
    } else if (currentRightPanel === 'instances') {
      return <Instances sailplane={sailplaneRef.current} />;
    }
  };

  return (
    <div style={styles.container}>
        <LeftPanel
          setCurrentRightPanel={setCurrentRightPanel}
          currentRightPanel={currentRightPanel}
        />

      {ready ? getRightPanel() : <LoadingRightBlock />}
    </div>
  );
}

export default hot(module)(App);
