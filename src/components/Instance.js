import React from 'react';
import {primary3, primary4, primary45, primary6} from '../colors';
import useHover from '../hooks/useHover';

export function Instance({data, selected, onClick}) {
  const [hoverRef, isHovered] = useHover();

  const styles = {
    container: {
      padding: 10,
      backgroundColor: selected ? primary3 : '#FFF',
      color: selected ? '#FFF' : primary4,
      border: `1px solid ${isHovered ? primary4 : primary3}`,
      borderRadius: 4,
      marginBottom: 4,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Open Sans',
    },
    address: {
      marginLeft: 10,
      fontSize: 14,
      overflow: 'hidden',
    },
  };

  const {name, address} = data;

  return (
    <div ref={hoverRef} style={styles.container} onClick={onClick}>
      <div>{name}</div>
      <div style={styles.address}>{address}</div>
    </div>
  );
}
