import React from 'react';
import {errorColor, primary, primary4} from '../colors';
import {FaFolder, FaTrash} from 'react-icons/fa';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';

export function FileItem({data, sharedFs}) {
  const {path, type} = data;
  const pathSplit = path.split('/');
  const name = pathSplit[pathSplit.length - 1];
  const [hoverRef, isHovered] = useHover();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      border: isHovered ? `1px solid ${primary4}` : '1px solid #FFF',
      borderRadius: 4,
      color: primary,
      fontSize: 14,
      padding: 7,
      cursor: 'pointer',
    },
    nameContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 4,
    },
    tools: {
      opacity: isHovered ? 1 : 0,
      fontSize: 14,
    },
  };

  return (
    <div
      style={styles.container}
      ref={hoverRef}
      onClick={() => {
        if (type === 'dir') {
          console.log('clock');
        } else {
        }
      }}>
      <div style={styles.nameContainer}>
        <FaFolder color={primary4} size={16} style={styles.icon} />
        {name}
      </div>
      <div style={styles.tools}>
        <ToolItem
          iconComponent={FaTrash}
          onClick={async (event) => {
            event.stopPropagation();

            await sharedFs.current.remove(path);
          }}
        />
      </div>
    </div>
  );
}
