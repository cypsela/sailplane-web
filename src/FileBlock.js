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
  },
  fileHeaderItem: {
    width: '100%',
    color: primary,
    fontSize: 14,
  },
  tools: {
    textAlign: 'right',
  }
};

export function FileBlock() {
  return (
    <div style={styles.container}>
      <Breadcrumb />

      <div style={styles.tools}>
        <FiFolderPlus color={primary4} size={16} style={styles.icon} />

      </div>
      <div style={styles.files}>
        <div style={styles.fileHeader}>
          <div style={styles.fileHeaderItem}>Name</div>
          <div style={styles.fileHeaderItem}>Modified</div>
        </div>
        <FileItem />
      </div>
      <DropZone />
    </div>
  );
}
