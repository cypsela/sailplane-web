import React, {useState} from 'react';
import {ToolItem} from './components/ToolItem';
import {
  FiFolderPlus,
  FiUnlock,
  FiLock,
  FiUpload,
  FiShare2,
} from 'react-icons/fi';
import {errorColor, goodColor, primary4} from './colors';
import {Breadcrumb} from './components/Breadcrumb';
import useTextInput from './hooks/useTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {clearEncryptionKey, setEncryptionKey} from './actions/main';
import {setShareData} from './actions/tempData';
import {useIsSmallScreen} from './hooks/useIsSmallScreen';

const styles = {
  tools: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontFamily: 'Open Sans',
    marginTop: 4,
    marginBottom: 10,
  },
  leftTools: {
    display: 'flex',
    alignItems: 'center',
  },
  rightTools: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

export function FolderTools({
  currentDirectory,
  sharedFs,
  setCurrentDirectory,
  handleOpenUpload,
}) {
  const [addFolderMode, setAddFolderMode] = useState(false);
  const [securePanelOpen, setSecurePanelOpen] = useState(false);
  const dispatch = useDispatch();
  const encryptionKey = useSelector((state) => state.main.encryptionKey);
  const pathSplit = currentDirectory.split('/');
  const folderName = pathSplit[pathSplit.length - 1];
  const isSmallScreen = useIsSmallScreen();

  const createFolder = async (newFolderName) => {
    try {
      await sharedFs.current.mkdir(currentDirectory, newFolderName);
      setAddFolderMode(false);
    } catch (e) {
      console.log('Mkdir error', e);
      // Todo: handle error
    }
  };

  const InputComponent = useTextInput(
    addFolderMode,
    (newFolderName) => createFolder(newFolderName),
    () => setAddFolderMode(false),
    '',
    {
      placeholder: 'folder name',
    },
  );

  const setSecure = (password) => {
    dispatch(setEncryptionKey(password, 'string'));
    setSecurePanelOpen(false);
  };

  const SecureInputComponent = useTextInput(
    securePanelOpen,
    (password) => setSecure(password),
    () => setSecurePanelOpen(false),
    '',
    {
      placeholder: 'secure password',
      isPassword: true,
    },
  );

  return (
    <div>
      <div style={styles.tools}>
        <div style={styles.leftTools}>
          {isSmallScreen && (securePanelOpen || addFolderMode) ? null : (
            <Breadcrumb
              currentDirectory={currentDirectory}
              setCurrentDirectory={setCurrentDirectory}
            />
          )}
        </div>
        <div style={styles.rightTools}>
          {!addFolderMode && !securePanelOpen ? (
            <>
              <ToolItem
                id={'togglePassword'}
                iconComponent={encryptionKey ? FiLock : FiUnlock}
                size={18}
                defaultColor={encryptionKey ? goodColor : null}
                changeColor={encryptionKey ? errorColor : goodColor}
                onClick={() => {
                  if (encryptionKey) {
                    dispatch(clearEncryptionKey());
                  } else {
                    setSecurePanelOpen(true);
                  }
                }}
              />
              {currentDirectory !== '/r' ? (
                <ToolItem
                  id={'folderShare'}
                  iconComponent={FiShare2}
                  size={18}
                  changeColor={primary4}
                  onClick={() => {
                    dispatch(
                      setShareData({
                        name: folderName,
                        path: currentDirectory,
                        pathType: 'dir',
                      }),
                    );
                  }}
                />
              ) : null}
              <ToolItem
                iconComponent={FiUpload}
                size={18}
                changeColor={primary4}
                onClick={() => {
                  handleOpenUpload();
                }}
              />
              <ToolItem
                id={'addFolder'}
                iconComponent={FiFolderPlus}
                size={18}
                changeColor={primary4}
                onClick={() => setAddFolderMode(true)}
              />
            </>
          ) : null}

          {addFolderMode ? <>{InputComponent}</> : null}

          {securePanelOpen ? <>{SecureInputComponent}</> : null}
        </div>
      </div>
    </div>
  );
}
