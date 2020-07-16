import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {LeftPanel} from './LeftPanel';
import {FileBlock} from './FileBlock';
import {useIsMobile} from './hooks/useIsMobile';
import useIPFS from './hooks/useIPFS';
import OrbitDB from 'orbit-db';
import Sailplane from '@cypsela/sailplane-node';
import {LoadingRightBlock} from './LoadingRightBlock';
import {hot} from 'react-hot-loader';
import {Settings} from './Settings';
import {Instances} from './Instances';
import {useDispatch, useSelector} from 'react-redux';
import {addInstance, setInstanceIndex, setNewUser} from './actions/main';
import {setStatus} from './actions/tempData';
import usePrevious from './hooks/usePrevious';
import {ContextMenu} from './ContextMenu';
import {delay, getPercent} from './utils/Utils';
import all from 'it-all';
import OrbitDBAddress from 'orbit-db/src/orbit-db-address';

function App({match}) {
  const isMobile = useIsMobile();
  const sailplaneRef = useRef(null);
  const mountQueue = useRef({});
  const [nodeReady, setNodeReady] = useState(false);
  const sharedFS = useRef({});
  const [ipfsError, setIpfsError] = useState(false);
  const ipfsObj = useIPFS(() => {
    setIpfsError(true);
  });
  const [instanceReady, setInstanceReady] = useState(false);
  const [directoryContents, setDirectoryContents] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('/r');
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [currentRightPanel, setCurrentRightPanel] = useState('files');
  const {importInstanceAddress} = match.params;
  const cleanImportInstanceAddress = decodeURIComponent(importInstanceAddress);

  const dispatch = useDispatch();
  const {instances, instanceIndex, newUser} = useSelector(
    (state) => state.main,
  );
  const currentInstance = instances[instanceIndex];
  const prevInstanceIndex = usePrevious(instanceIndex);

  const styles = {
    container: {
      position: 'relative',
      display: isMobile ? 'block' : 'flex',
      flexDirection: 'row',
      height: '100%',
    },
  };

  useEffect(() => {
    function importInstance() {
      if (cleanImportInstanceAddress) {
        if (OrbitDBAddress.isValid(cleanImportInstanceAddress)) {
          const address = OrbitDBAddress.parse(cleanImportInstanceAddress);
          const sameInstance = instances.find(
            (instance) => instance.address === address.toString(),
          );

          if (!sameInstance) {
            dispatch(addInstance(address.path, address.toString(), true));
          }
        }
      }
    }

    importInstance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanImportInstanceAddress]);
  // End

  useEffect(() => {
    const rootLS = async () => {
      if (instanceReady) {
        const contents = sharedFS.current.fs
          .ls(currentDirectory)
          .map((path) => {
            const type = sharedFS.current.fs.content(path);
            const pathSplit = path.split('/');
            const name = pathSplit[pathSplit.length - 1];

            return {path, name, type};
          });

        setDirectoryContents(contents);
      }
    };

    rootLS();
  }, [instanceReady, currentDirectory, lastUpdateTime]);

  useEffect(() => {
    const switchInstance = async (doLS) => {
      setInstanceReady(false);
      if (!instances.length) {
        return;
      }
      dispatch(setStatus({message: 'Looking for drive...'}));

      const sailplane = sailplaneRef.current;
      const address = currentInstance.address;

      const sfsOptions = {autoStart: false};
      const sfs =
        sailplane.mounted[address] ||
        (await mountQueue.current[address]) ||
        (await (() => {
          return (mountQueue.current[address] = sailplane
            .mount(address, sfsOptions)
            .finally(() => delete mountQueue.current[address]));
        })());

      const onProgress = (key) => (current, max) => {
        dispatch(setStatus({message: `${key} ${getPercent(current, max)}%`}));
        if (current === max) {
          delay(1500).then(() => dispatch(setStatus({})));
        }
      };

      const onLoad = onProgress('Load');
      sfs.events.on('db.load.progress', onLoad);

      const onReplicate = onProgress('Sync');
      sfs.events.on('db.replicate.progress', onReplicate);

      const onUpdated = () => setLastUpdateTime(Date.now());
      sfs.events.on('updated', onUpdated);

      sfs.tearDown = () => {
        sfs.events.removeListener('db.load.progress', onLoad);
        sfs.events.removeListener('db.replicate.progress', onReplicate);
        sfs.events.removeListener('updated', onUpdated);
      };

      if (sharedFS.current.tearDown) {
        sharedFS.current.tearDown();
      }

      if (!sfs.running) {
        await sfs.start();
      }

      sharedFS.current = sfs;

      if (doLS) {
        setCurrentDirectory('/r');
        setLastUpdateTime(Date.now());
      }

      setInstanceReady(true);
      dispatch(setStatus({}));
    };

    if (nodeReady) {
      switchInstance(prevInstanceIndex !== instanceIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeReady, instanceIndex, instances]);

  useEffect(() => {
    const handleNewUser = async (sailplane) => {
      const defaultOptions = {meta: 'superdrive'};
      const defaultAddress = await sailplane.determineAddress(
        'default',
        defaultOptions,
      );
      dispatch(
        addInstance(defaultAddress.path, defaultAddress.toString(), false),
      );
      dispatch(setNewUser(false));
    };
    const connectSailplane = async (ipfs) => {
      dispatch(setStatus({message: 'Connecting'}));
      const orbitdb = await OrbitDB.createInstance(ipfs);
      const sailplane = await Sailplane.create(orbitdb);
      sailplaneRef.current = sailplane;

      if (newUser) {
        await handleNewUser(sailplane);
      }
      setNodeReady(true);
      dispatch(setStatus({}));

      window.sailplane = sailplane;
      window.all = all;
    };

    if (ipfsObj.isIpfsReady) {
      connectSailplane(ipfsObj.ipfs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipfsObj.ipfs, ipfsObj.isIpfsReady]);

  const getRightPanel = () => {
    if (currentRightPanel === 'files') {
      const noDrives = instances.length === 0;
      const message = !noDrives ? 'Looking for drive...' : 'Create a drive';
      return !instanceReady ? (
        <LoadingRightBlock message={message} loading={!noDrives} />
      ) : (
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

      {nodeReady ? (
        getRightPanel()
      ) : (
        <LoadingRightBlock ipfsError={ipfsError} />
      )}
      <ContextMenu />
    </div>
  );
}

export default hot(module)(App);
