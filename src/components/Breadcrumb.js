import React from 'react';
import {FaChevronRight} from 'react-icons/fa';
import {primary45} from '../utils/colors';
import {InstanceSelector} from './InstanceSelector';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    color: primary45,
    fontFamily: 'Open Sans',
    fontWeight: 400,
    userSelect: 'none',
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: 4,
  },
  root: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 400,
  },
  folderIcon: {
    marginLeft: 4,
    marginRight: 4,
  },
  folderName: {
    fontWeight: 400,
    cursor: 'pointer',
    marginLeft: 2,
    marginRight: 2,
  },
};

export function Breadcrumb({currentDirectory, setCurrentDirectory}) {
  const pathArr = currentDirectory.split('/').slice(2);

  return (
    <div style={styles.container}>
      <div onClick={() => setCurrentDirectory('/r')} style={styles.root}>
        <FaChevronRight color={primary45} size={16} style={styles.icon} />
        <InstanceSelector /> /
      </div>
      {pathArr.map((pathItem, index) => {
        let path = '/r';
        for (let i = 0; i <= index; i++) {
          path += `/${pathArr[i]}`;
        }

        return (
          <span key={pathItem}>
            <span
              style={styles.folderName}
              className={'folderName'}
              onClick={() => {
                setCurrentDirectory(path);
              }}>
              {pathItem}
            </span>
            /
          </span>
        );
      })}
    </div>
  );
}
