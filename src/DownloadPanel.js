import React, {useState} from 'react';
import {StatusBar} from './StatusBar';
import {primary45} from './colors';
import {
  doesPasswordMatchHash,
  getEncryptionInfoFromFilename,
} from './utils/encryption';
import {FiLock} from 'react-icons/fi';
import useTextInput from './hooks/useTextInput';
import ImageGallery from './components/ImageGallery';

const styles = {
  container: {
    position: 'relative',
    padding: 10,
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
};

export function DownloadPanel({
  ready,
  path,
  handleDownload,
  downloadComplete,
  displayType,
  files,
}) {
  const pathSplit = path.split('/');
  const name = pathSplit[pathSplit.length - 1];
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [enterPasswordMode, setEnterPasswordMode] = useState(false);
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
      confirmTitle: 'Enter',
    },
  );

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

            {displayType !== 'default' ? (
              <div>
                {displayType === 'image' ? (
                  <ImageGallery files={files} />
                ) : null}
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
