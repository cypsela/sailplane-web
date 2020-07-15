import React, {useState} from 'react';
import {StatusBar} from './StatusBar';
import {primary2, primary35, primary45} from './colors';
import {
  doesPasswordMatchHash,
  getEncryptionInfoFromFilename,
} from './utils/encryption';
import {FiLock} from 'react-icons/fi';
import useTextInput from './hooks/useTextInput';
import ImageGallery from './components/ImageGallery';
import {humanFileSize, sortDirectoryContents} from './utils/Utils';
import {FilePreview} from './components/FilePreview';
import {FileItem} from './components/FileItem';
import {useIsMobile} from './hooks/useIsMobile';
import AudioPlaylist from "./components/AudioPlaylist";

const styles = {
  container: {
    position: 'relative',
    padding: 10,
    paddingTop: 20,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  filename: {
    color: primary45,
    fontSize: 20,
    textAlign: 'center',
  },
  fileSize: {
    fontSize: 14,
    textAlign: 'center',
    color: primary45,
  },
  downloadButton: {
    display: 'inline-block',
    backgroundColor: primary45,
    color: '#FFF',
    borderRadius: 4,
    padding: 12,
    marginTop: 10,
    cursor: 'pointer',
  },
  icon: {
    marginRight: 4,
  },
  passwordContainer: {
    marginTop: 10,
  },
  downloadButtonHolder: {
    textAlign: 'center',
    marginBottom: 8,
  },
  previewBlock: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
  },
  fileHeader: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${primary2}`,
    paddingBottom: 10,
    marginBottom: 4,
  },
  fileHeaderItem: {
    width: '100%',
    color: primary35,
    fontSize: 12,
    letterSpacing: 1.08,
    textAlign: 'left',
  },
};

export function DownloadPanel({
  ready,
  path,
  handleDownload,
  downloadComplete,
  displayType,
  files,
  fileInfo,
  fileBlob,
  ipfs,
}) {
  const pathSplit = path.split('/');
  const name = pathSplit[pathSplit.length - 1];
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [enterPasswordMode, setEnterPasswordMode] = useState(false);
  const isMobile = useIsMobile();
  const {
    isEncrypted,
    decryptedFilename,
    passHash,
  } = getEncryptionInfoFromFilename(name);

  const doesPasswordFailHashCheck = async (text) => {
    return await doesPasswordMatchHash(text, passHash);
  };

  const setDecryptPassword = async (password) => {
    let doesNotMatchHash = await doesPasswordFailHashCheck(password);
    if (!doesNotMatchHash) {
      setEnterPasswordMode(false);

      handleDownload(password);
    }
  };

  const PasswordInputComponent = useTextInput(
    enterPasswordMode,
    (password) => setDecryptPassword(password),
    () => setEnterPasswordMode(false),
    '',
    {
      placeholder: 'password',
      isPassword: true,
      isError: doesPasswordFailHashCheck,
      confirmTitle: 'Unlock',
    },
  );

  const sortedFiles = sortDirectoryContents(files);

  return (
    <div style={styles.container}>
      <div>
        {ready ? (
          <div>
            <div style={styles.filename}>
              {isEncrypted ? (
                <FiLock color={primary45} size={16} style={styles.icon} />
              ) : null}

              {decryptedFilename}
            </div>
            <div style={styles.downloadButtonHolder}>
              {!enterPasswordMode ? (
                <div
                  style={styles.downloadButton}
                  onClick={() => {
                    if (isEncrypted) {
                      setEnterPasswordMode(true);
                      return;
                    }

                    setDownloadClicked(true);
                    handleDownload();
                  }}>
                  {downloadClicked && !downloadComplete
                    ? 'Fetching download...'
                    : 'Download now'}
                </div>
              ) : (
                <div style={styles.passwordContainer}>
                  {PasswordInputComponent}
                </div>
              )}
            </div>

            {fileInfo?.size ? (
              <div style={styles.fileSize}>{humanFileSize(fileInfo.size)}</div>
            ) : null}

            {fileBlob ? (
              <div style={styles.previewBlock}>
                <div style={styles.preview}>
                  <FilePreview blob={fileBlob} filename={name} size={'large'} />
                </div>
              </div>
            ) : null}

            {displayType !== 'default' ? (
              <div>
                {displayType === 'image' ? (
                  <ImageGallery files={files} />
                ) : null}

                {displayType === 'audio' ? (
                  <AudioPlaylist files={files} ipfs={ipfs}/>
                ) : null}
              </div>
            ) : null}

            {files && displayType !=='audio' ? (
              <div style={styles.fileContainer}>
                <div style={styles.fileHeader}>
                  <div style={{...styles.fileHeaderItem, paddingLeft: 12}}>
                    Name
                  </div>
                  {!isMobile ? (
                    <>
                      <div
                        style={{...styles.fileHeaderItem, textAlign: 'right'}}>
                        Size
                      </div>
                      <div
                        style={{...styles.fileHeaderItem, textAlign: 'right'}}>
                        {/*Modified*/}
                      </div>
                    </>
                  ) : null}

                  <div style={styles.fileHeaderItem}></div>
                </div>
                {sortedFiles.map((file) => (
                  <FileItem
                    data={file}
                    setCurrentDirectory={() => {}}
                    readOnly={true}
                    ipfs={ipfs}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div />
        )}
      </div>
      <StatusBar />
    </div>
  );
}
