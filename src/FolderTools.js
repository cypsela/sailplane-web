import React, {useState} from 'react';
import {ToolItem} from './components/ToolItem';
import {FiFolderPlus} from 'react-icons/fi';
import {primary} from './colors';
import {Breadcrumb} from './components/Breadcrumb';
import useTextInput from './hooks/useTextInput';

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

export function FolderTools({currentDirectory, sharedFs, setCurrentDirectory}) {
  const [addFolderMode, setAddFolderMode] = useState(false);
  const InputComponent = useTextInput(
    addFolderMode,
    (newFolderName) => createFolder(newFolderName),
    () => setAddFolderMode(false),
    '',
    {
      placeholder: 'new folder',
      actionTitle: 'Create',
    }
  );

  const createFolder = async (newFolderName) => {
    try {
      await sharedFs.current.mkdir(currentDirectory, newFolderName);
      setAddFolderMode(false);
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
            <>{InputComponent}</>
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
