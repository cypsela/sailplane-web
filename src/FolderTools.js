import React, {useState} from 'react';
import {ToolItem} from './components/ToolItem';
import {FiFolderPlus, FiUnlock, FiLock, FiUpload} from 'react-icons/fi';
import {errorColor, goodColor, primary} from './colors';
import {Breadcrumb} from './components/Breadcrumb';
import useTextInput from './hooks/useTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {clearEncryptionKey, setEncryptionKey} from './actions/main';

const styles = {
  tools: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Open Sans',
  },
  rightTools: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

export function FolderTools({currentDirectory, sharedFs, setCurrentDirectory, handleOpenUpload}) {
  const [addFolderMode, setAddFolderMode] = useState(false);
  const [securePanelOpen, setSecurePanelOpen] = useState(false);
  const dispatch = useDispatch();
  const encryptionKey = useSelector((state) => state.main.encryptionKey);

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
      placeholder: 'new folder',
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
          <Breadcrumb
            currentDirectory={currentDirectory}
            setCurrentDirectory={setCurrentDirectory}
          />
        </div>
        <div style={styles.rightTools}>
          {!addFolderMode && !securePanelOpen ? (
            <>
              <ToolItem
                iconComponent={encryptionKey ? FiLock : FiUnlock}
                size={18}
                defaultColor={encryptionKey ? goodColor : null}
                changeColor={encryptionKey?errorColor:goodColor}
                onClick={() => {
                  if (encryptionKey) {
                    dispatch(clearEncryptionKey());
                  } else {
                    setSecurePanelOpen(true);
                  }
                }}
              />
              <ToolItem
                iconComponent={FiUpload}
                size={18}
                changeColor={primary}
                onClick={() => {
                  handleOpenUpload();
                }}
              />
              <ToolItem
                id={'addFolder'}
                iconComponent={FiFolderPlus}
                size={18}
                changeColor={primary}
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
