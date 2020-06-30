import React from 'react';
import {primary, primary4} from '../colors';
import {FaFolder} from 'react-icons/fa';
import useHover from '../hooks/useHover';

export function FileItem({data}) {
  const {path, type} = data;
  const pathSplit = path.split('/');
  const name = pathSplit[pathSplit.length - 1];
  const [hoverRef, isHovered] = useHover();

  const styles = {
    container: {
      border: isHovered?`1px solid ${primary4}`:'1px solid #FFF',
      borderRadius: 4,
      color: primary,
      fontSize: 14,
      padding: 7,
      // paddingLeft: 0,
    },
    nameContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 4,
    },
  };

  return (
    <div style={styles.container} ref={hoverRef}>
      <div style={styles.nameContainer}>
        <FaFolder color={primary4} size={16} style={styles.icon} />
        {name}
      </div>
    </div>
  );
}
