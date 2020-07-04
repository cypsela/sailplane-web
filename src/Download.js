import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import {LeftPanel} from './LeftPanel';
import {useWindowSize} from './hooks/useWindowSize';
import useIPFS from './hooks/useIPFS';
import OrbitDB from 'orbit-db';
import Sailplane from '@cypsela/sailplane-node';
import {LoadingRightBlock} from './LoadingRightBlock';
import {hot} from 'react-hot-loader';
import {useDispatch} from 'react-redux';
import {setStatus} from './actions/tempData';
import {getBlobFromPath} from './utils/Utils';
import {saveAs} from 'file-saver';
import {DownloadPanel} from './DownloadPanel';

function Download({match}) {
  const windowSize = useWindowSize();
  const windowWidth = windowSize.width;
  const ipfsObj = useIPFS();
  const sharedFS = useRef({});
  const sailplaneRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const [currentRightPanel, setCurrentRightPanel] = useState('files');
  const {address, path} = match.params;
  const cleanAddress = decodeURIComponent(address);
  const cleanPath = decodeURIComponent(path);
  const dispatch = useDispatch();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
    },
  };

  const connectOrbit = useCallback(async (ipfs, doLS) => {
    dispatch(setStatus({message: 'Initializing'}));
    const orbitdb = await OrbitDB.createInstance(ipfs);

    const sailplane = await Sailplane.create(orbitdb, {});

    sharedFS.current = await sailplane.mount(cleanAddress, {});

    sailplaneRef.current = sailplane;

    setReady(true);
    dispatch(setStatus({}));
  }, []);

  // Connect orbit todo: refactor hook
  useEffect(() => {
    if (ipfsObj.isIpfsReady && !ready) {
      connectOrbit(ipfsObj.ipfs);
    }
  }, [ipfsObj.ipfs, ipfsObj.isIpfsReady, ready, connectOrbit]);

  const getDownload = async () => {
    dispatch(setStatus({message: 'Fetching file'}));
    const blob = await getBlobFromPath(sharedFS, cleanPath, ipfs);
    dispatch(setStatus({}));

    const pathSplit = cleanPath.split('/');
    const name = pathSplit[pathSplit.length - 1];
    saveAs(blob, name);
    setDownloadComplete(true);
  };

  return (
    <div style={styles.container}>
      {windowWidth > 600 ? (
        <LeftPanel
          setCurrentRightPanel={setCurrentRightPanel}
          currentRightPanel={currentRightPanel}
        />
      ) : null}

      {ready ? (
        <DownloadPanel
          handleDownload={getDownload}
          ready={ready}
          path={cleanPath}
          downloadComplete={downloadComplete}
        />
      ) : (
        <LoadingRightBlock />
      )}
    </div>
  );
}

export default hot(module)(Download);
