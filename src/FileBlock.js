import {Breadcrumb} from './components/Breadcrumb';
import {FileItem} from './components/FileItem';
import {DropZone} from './DropZone';
import React from 'react';
import {primary, primary2, primary4} from './colors';
import {FiFolderPlus} from 'react-icons/fi';

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
    color: primary,
    fontSize: 14,
  },
  tools: {
    textAlign: 'right',
  },
};

export function FileBlock({sharedFs, directoryContents}) {
  return (
    <div style={styles.container}>
      <Breadcrumb />

      <div style={styles.tools}>
        <FiFolderPlus
          color={primary4}
          size={18}
          style={styles.icon}
          onClick={async () => {
            await sharedFs.current.mkdir(
              '/r',
              'dir1' + Date.now(),
            );
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
      {directoryContents.map(fileItem=><FileItem data={fileItem}/>)}
    </div>
  );
}
