import {Breadcrumb} from './components/Breadcrumb';
import {FileItem} from './components/FileItem';
import {DropZone} from './DropZone';
import React from 'react';
import {primary2, primary5} from './colors';
import {FolderTools} from './FolderTools';

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
};

export function FileBlock({
  sharedFs,
  directoryContents,
  setCurrentDirectory,
  currentDirectory,
}) {
  const sortedContents = directoryContents.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  return (
    <div style={styles.container}>
      <Breadcrumb
        currentDirectory={currentDirectory}
        setCurrentDirectory={setCurrentDirectory}
      />

      <FolderTools currentDirectory={currentDirectory} sharedFs={sharedFs} />
      <div style={styles.files}>
        <div style={styles.fileHeader}>
          <div style={{...styles.fileHeaderItem, marginLeft: 8}}>Name</div>
          <div style={styles.fileHeaderItem}>Modified</div>
        </div>
      </div>
      {!directoryContents.length ? <DropZone /> : null}
      {sortedContents.map((fileItem) => (
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
