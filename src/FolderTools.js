import React, {useEffect, useRef, useState} from 'react';
import {ToolItem} from './components/ToolItem';
import {FiFolderPlus} from 'react-icons/fi';
import {primary, primary3} from './colors';
import {Breadcrumb} from "./components/Breadcrumb";

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
  editInput: {
    border: `1px solid ${primary3}`,
    borderRadius: 4,
    color: primary,
    fontSize: 14,
    fontWeight: 200,
    padding: 4,
  },
};

export function FolderTools({currentDirectory, sharedFs, setCurrentDirectory}) {
  const [addFolderMode, setAddFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const folderInputRef = useRef(null);

  useEffect(() => {
    if (addFolderMode) {
      folderInputRef.current.focus();
    }
  }, [addFolderMode]);

  const createFolder = async () => {
    try {
      await sharedFs.current.mkdir(currentDirectory, newFolderName);
      setAddFolderMode(false);
      setNewFolderName('');
    } catch (e) {
      console.log('Mkdir error', e);
      // Todo: handle error
    }
  };

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
          {addFolderMode ? (
            <>
              <input
                ref={folderInputRef}
                type={'text'}
                placeholder={'new folder'}
                style={styles.editInput}
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    createFolder();
                  }
                }}
              />
              <ToolItem title={'Create'} onClick={createFolder} />
              <ToolItem
                title={'Cancel'}
                onClick={() => {
                  setAddFolderMode(false);
                }}
              />
            </>
          ) : (
            <ToolItem
              iconComponent={FiFolderPlus}
              size={18}
              changeColor={primary}
              onClick={() => setAddFolderMode(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
