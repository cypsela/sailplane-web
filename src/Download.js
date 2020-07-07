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
import {getBlobFromPathCID, getFilesFromFolderCID} from './utils/Utils';
import {saveAs} from 'file-saver';
import {DownloadPanel} from './DownloadPanel';
import {decryptFile, getEncryptionInfoFromFilename} from './utils/encryption';

function Download({match}) {
  const {cid, path, displayType} = match.params;
  const windowSize = useWindowSize();
  const windowWidth = windowSize.width;
  const ipfsObj = useIPFS();
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState(null);

  const [downloadComplete, setDownloadComplete] = useState(false);
  const [currentRightPanel, setCurrentRightPanel] = useState('files');
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

  const getFileList = async () => {
    const tmpFiles = await getFilesFromFolderCID(ipfsObj.ipfs, cleanCID, () => {
      console.log('updateping');
    });

    setFiles(tmpFiles.slice(1));
  };

  useEffect(() => {
    if (ipfsObj.isIpfsReady && !ready) {
      setReady(true);

      if (displayType) {
        getFileList();
      }
    }
  }, [ipfsObj.ipfs, ipfsObj.isIpfsReady, ready, displayType, cleanCID]);

  const getDownload = async (password) => {
    dispatch(setStatus({message: 'Fetching file'}));
    let blob = await getBlobFromPathCID(
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

    const {isEncrypted, decryptedFilename} = getEncryptionInfoFromFilename(
      name,
    );

    if (isEncrypted) {
      dispatch(setStatus({message: 'Decrypting file'}));
      blob = await decryptFile(blob, password);
      dispatch(setStatus({}));
    }

    saveAs(blob, decryptedFilename);
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
          cid={cleanCID}
          files={files}
          displayType={displayType}
          downloadComplete={downloadComplete}
        />
      ) : (
        <LoadingRightBlock />
      )}
    </div>
  );
}

export default hot(module)(Download);
