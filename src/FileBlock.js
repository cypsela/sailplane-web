import {Breadcrumb} from './components/Breadcrumb';
import {FileItem} from './components/FileItem';
import {DropZone} from './DropZone';
import React from 'react';
import {primary, primary2, primary4, primary5} from './colors';
import {FiFolderPlus} from 'react-icons/fi';
import {ToolItem} from './components/ToolItem';

const styles = {
  container: {
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'scroll',
  },
  files: {
    marginTop: 20,
  },
  fileHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${primary2}`,
    paddingBottom: 10,
    marginBottom: 4,
  },
  fileHeaderItem: {
    width: '100%',
    color: primary5,
    fontSize: 14,
  },
  tools: {
    textAlign: 'right',
  },
  icon: {
    cursor: 'pointer',
  },
};

export function FileBlock({
  sharedFs,
  directoryContents,
  setCurrentDirectory,
  currentDirectory,
}) {
  return (
    <div style={styles.container}>
      <Breadcrumb
        currentDirectory={currentDirectory}
        setCurrentDirectory={setCurrentDirectory}
      />

      <div style={styles.tools}>
        <ToolItem
          iconComponent={FiFolderPlus}
          size={18}
          changeColor={primary}
          onClick={async () => {
            await sharedFs.current.mkdir(currentDirectory, 'dir1' + Date.now());
          }}
        />
      </div>
      <div style={styles.files}>
        <div style={styles.fileHeader}>
          <div style={{...styles.fileHeaderItem, marginLeft: 8}}>Name</div>
          <div style={styles.fileHeaderItem}>Modified</div>
        </div>
      </div>
      {!directoryContents.length ? <DropZone /> : null}
      {directoryContents.map((fileItem) => (
        <FileItem
          key={fileItem.path}
          data={fileItem}
          sharedFs={sharedFs}
          setCurrentDirectory={setCurrentDirectory}
        />
      ))}
    </div>
  );
}
