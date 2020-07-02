import React from 'react';
import {FaChevronRight} from 'react-icons/fa';
import {primary4} from '../colors';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    marginBottom: 10,
    color: primary4,
    fontFamily: 'Open Sans',
    fontWeight: 600,
    userSelect: 'none',
  },
  icon: {
    marginRight: 4,
    cursor: 'pointer',
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
      <FaChevronRight
        color={primary4}
        size={16}
        style={styles.icon}
        onClick={() => setCurrentDirectory('/r')}
      />{' '}
      /
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
