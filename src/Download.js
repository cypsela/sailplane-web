import React, {useEffect, useState} from 'react';
import './App.css';
import {LeftPanel} from './LeftPanel';
import {useIsMobile} from './hooks/useIsMobile';
import useIPFS from './hooks/useIPFS';
import {LoadingRightBlock} from './LoadingRightBlock';
import {hot} from 'react-hot-loader';
import {useDispatch} from 'react-redux';
import {setStatus} from './actions/tempData';
import {
  getBlobFromPathCID,
  getFileExtensionFromFilename,
  getFileInfoFromCID,
  getFilesFromFolderCID,
  isFileExtensionSupported,
  getPercent,
} from './utils/Utils';
import {saveAs} from 'file-saver';
import {DownloadPanel} from './DownloadPanel';
import {decryptFile, getEncryptionInfoFromFilename} from './utils/encryption';

function Download({match}) {
  const {cid, path, displayType} = match.params;
  const isMobile = useIsMobile();
  const ipfsObj = useIPFS();
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const [downloadComplete, setDownloadComplete] = useState(false);
  const [currentRightPanel, setCurrentRightPanel] = useState('files');
  const [fileBlob, setFileBlob] = useState(null);
  const cleanPath = decodeURIComponent(path);
  const cleanCID = decodeURIComponent(cid);
  const dispatch = useDispatch();
  const pathSplit = cleanPath.split('/');
  const name = pathSplit[pathSplit.length - 1];
  const isSupportedPreviewType = isFileExtensionSupported(
    getFileExtensionFromFilename(name),
  );

  useEffect(() => {
    if (
      isSupportedPreviewType &&
      ready &&
      !fileBlob &&
      displayType === 'default'
    ) {
      getBlob();
    }
  }, [isSupportedPreviewType, ready, fileBlob, cleanCID, path]);

  const {isEncrypted, decryptedFilename} = getEncryptionInfoFromFilename(name);

  const styles = {
    container: {
      display: isMobile ? 'block' : 'flex',
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

  const getFileInfo = async () => {
    const fileInfo = await getFileInfoFromCID(cleanCID, ipfsObj.ipfs);

    setFileInfo(fileInfo);
  };

  useEffect(() => {
    if (ipfsObj.isIpfsReady && !ready) {
      setReady(true);

      if (displayType) {
        getFileList();
      }

      getFileInfo();
    }
  }, [ipfsObj.ipfs, ipfsObj.isIpfsReady, ready, displayType, cleanCID]);

  async function getBlob() {
    let blob;

    if (fileBlob) {
      blob = fileBlob;
    } else {
      blob = await getBlobFromPathCID(
        cleanCID,
        cleanPath,
        ipfsObj.ipfs,
        (currentIndex, totalCount) => {
          dispatch(
            setStatus({
              message: `[${getPercent(currentIndex, totalCount)}%] Downloading`,
            }),
          );
        },
      );

      dispatch(setStatus({}));
      setFileBlob(blob);
    }

    return blob;
  }

  const getDownload = async (password) => {
    dispatch(setStatus({message: 'Fetching file'}));
    let blob = await getBlob();

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
          fileInfo={fileInfo}
          fileBlob={fileBlob}
        />
      ) : (
        <LoadingRightBlock />
      )}
    </div>
  );
}

export default hot(module)(Download);
