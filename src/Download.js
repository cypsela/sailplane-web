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
import {getBlobFromPathCID} from './utils/Utils';
import {saveAs} from 'file-saver';
import {DownloadPanel} from './DownloadPanel';

function Download({match}) {
  const windowSize = useWindowSize();
  const windowWidth = windowSize.width;
  const ipfsObj = useIPFS();
  const [ready, setReady] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const [currentRightPanel, setCurrentRightPanel] = useState('files');
  const {cid, path} = match.params;
  const cleanPath = decodeURIComponent(path);
  const cleanCID = decodeURIComponent(cid);
  const dispatch = useDispatch();

  const styles = {
    container: {
      display: windowWidth > 600 ? 'flex' : 'block',
      flexDirection: 'row',
      height: '100%',
    },
  };

  useEffect(() => {
    if (ipfsObj.isIpfsReady && !ready) {
      setReady(true);
    }
  }, [ipfsObj.ipfs, ipfsObj.isIpfsReady, ready]);

  const getDownload = async () => {
    dispatch(setStatus({message: 'Fetching file'}));
    const blob = await getBlobFromPathCID(
      cleanCID,
      cleanPath,
      ipfsObj.ipfs,
      (currentIndex, totalCount) => {
        dispatch(
          setStatus({
            message: `[${Math.round(
              (currentIndex / totalCount) * 100,
            )}%] Downloading`,
          }),
        );
      },
    );
    dispatch(setStatus({}));

    const pathSplit = cleanPath.split('/');
    const name = pathSplit[pathSplit.length - 1];
    saveAs(blob, name);
    setDownloadComplete(true);
  };

  return (
    <div style={styles.container}>
      <LeftPanel
        setCurrentRightPanel={setCurrentRightPanel}
        currentRightPanel={currentRightPanel}
      />

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
