import React, {useEffect, useRef, useState} from 'react';
import '../App.css';
import {LeftPanel} from './LeftPanel';
import {FileBlock} from '../components/FileBlock';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';
import useIPFS from '../hooks/useIPFS';
import OrbitDB from 'orbit-db';
import Sailplane from '@cypsela/sailplane-node';
import * as sailplaneUtil from '../utils/sailplane-util';
import {LoadingRightBlock} from '../components/LoadingRightBlock';
import {hot} from 'react-hot-loader';
import {Settings} from './Settings';
import {Contacts} from './Contacts';
import {Instances} from './Instances';
import {useDispatch, useSelector} from 'react-redux';
import {addInstance, setNewUser} from '../actions/main';
import {setStatus} from '../actions/tempData';
import usePrevious from '../hooks/usePrevious';
import {ContextMenu} from '../components/ContextMenu';
import {delay, getPercent} from '../utils/Utils';
import all from 'it-all';
import {cleanBorder} from '../utils/colors';
import {useWindowSize} from '../hooks/useWindowSize';
import {IntroModal} from '../components/IntroModal';
import Crypter from '@tabcat/aes-gcm-crypter';

function App({}) {
  const isSmallScreen = useIsSmallScreen();
  const windowSize = useWindowSize();
  const sailplaneRef = useRef(null);
  const sfsQueue = useRef({});
  const [nodeReady, setNodeReady] = useState(false);
  const sharedFS = useRef({});
  const [ipfsError, setIpfsError] = useState(false);
  const ipfsObj = useIPFS((err) => {
    console.log('IPFS error: ' + err);
    setIpfsError(true);
  });
  const [instanceReady, setInstanceReady] = useState(false);
  const [directoryContents, setDirectoryContents] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('/r');
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [currentRightPanel, setCurrentRightPanel] = useState('files');
  const [wasNewUser, setWasNewUser] = useState(false);

  const dispatch = useDispatch();
  const {instances, instanceIndex, newUser} = useSelector(
    (state) => state.main,
  );
  const currentInstance = instances[instanceIndex];
  const prevInstanceIndex = usePrevious(instanceIndex);
  const prevInstance = usePrevious(currentInstance);

  const styles = {
    container: {
      position: 'relative',
      display: isSmallScreen ? 'block' : 'flex',
      flexDirection: 'row',
      height: '100%',
      maxWidth: 1920,
      margin: '0 auto',
      border: windowSize.width <= 1280 ? null : cleanBorder,
    },
  };

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
      if (
        !instances.length ||
        (prevInstance === currentInstance && instanceReady === true)
      ) {
        return;
      }

      setInstanceReady(false);
      dispatch(setStatus({message: 'Looking for drive...'}));
      const sfs = await sailplaneUtil.mount(
        sailplaneRef.current,
        currentInstance.address,
        sfsQueue.current,
        {Crypter},
      );

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
      const address = await sailplaneUtil.determineAddress(sailplane, {
        enc: true,
      });
      const driveName = sailplaneUtil.driveName(address);
      dispatch(addInstance(driveName, address.toString(), false, true));
    };
    const connectSailplane = async (ipfs) => {
      dispatch(setStatus({message: 'Connecting'}));
      const orbitdb = await OrbitDB.createInstance(ipfs);
      const sailplane = await Sailplane.create(orbitdb);
      sailplaneRef.current = sailplane;

      if ((newUser || wasNewUser) && instances.length === 0) {
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
      if (currentInstance && instanceReady && sharedFS.current.access.hasRead) {
        return (
          <FileBlock
            isEncrypted={sharedFS.current.encrypted}
            sharedFs={sharedFS}
            ipfs={ipfsObj.ipfs}
            directoryContents={directoryContents}
            setCurrentDirectory={setCurrentDirectory}
            currentDirectory={currentDirectory}
          />
        );
      }

      let message, loading;
      if (!instances.length) {
        message = 'Create a drive';
      } else if (!instanceReady) {
        message = 'Looking for drive...';
        loading = true;
      } else if (!sharedFS.current.access.hasRead) {
        message = 'You need permission to view this drive';
      }
      return (<LoadingRightBlock message={message} loading={loading} />)
    } else if (currentRightPanel === 'settings') {
      return <Settings sharedFS={sharedFS} />;
    } else if (currentRightPanel === 'contacts') {
      return <Contacts sharedFS={sharedFS} sailplane={sailplaneRef.current} />;
    } else if (currentRightPanel === 'instances') {
      return (
        <Instances
          sailplane={sailplaneRef.current}
          ipfs={ipfsObj.ipfs}
          sharedFS={sharedFS}
        />
      );
    }
  };

  const handleNewUser = () => {
    dispatch(setNewUser(false));
    setWasNewUser(true);
  };

  return (
    <div style={styles.container}>
      <IntroModal isVisible={newUser} onClose={() => handleNewUser()} />
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
