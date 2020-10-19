import React, {useState} from 'react';
import {ToolItem} from './ToolItem';
import {FiFolderPlus, FiUpload, FiShare2} from 'react-icons/fi';
import {primary4} from '../utils/colors';
import {Breadcrumb} from './Breadcrumb';
import useTextInput from '../hooks/useTextInput';
import {useDispatch} from 'react-redux';
import {setShareData} from '../actions/tempData';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';
import {
  doesUserHaveWriteInInstance,
  getInstanceAccessDetails,
} from '../utils/Utils';

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
  isEncrypted,
}) {
  const [addFolderMode, setAddFolderMode] = useState(false);
  const dispatch = useDispatch();
  const pathSplit = currentDirectory.split('/');
  const folderName = pathSplit[pathSplit.length - 1];
  const isSmallScreen = useIsSmallScreen();
  const hasWrite = doesUserHaveWriteInInstance(sharedFs.current);

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

  return (
    <div>
      <div style={styles.tools}>
        <div style={styles.leftTools}>
          {isSmallScreen && addFolderMode ? null : (
            <Breadcrumb
              currentDirectory={currentDirectory}
              setCurrentDirectory={setCurrentDirectory}
            />
          )}
        </div>
        <div style={styles.rightTools}>
          {!addFolderMode ? (
            <>
              {currentDirectory !== '/r' ? (
                <ToolItem
                  id={'folderShare'}
                  disabled={isEncrypted}
                  iconComponent={FiShare2}
                  size={18}
                  changeColor={isEncrypted ? '#DDD' : primary4}
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
              {hasWrite ? (
                <ToolItem
                  id={'addFolder'}
                  iconComponent={FiFolderPlus}
                  size={18}
                  changeColor={primary4}
                  onClick={() => setAddFolderMode(true)}
                />
              ) : null}
            </>
          ) : null}

          {addFolderMode ? <>{InputComponent}</> : null}
        </div>
      </div>
    </div>
  );
}
