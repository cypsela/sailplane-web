import React from 'react';
import {primary3, primary4, primary45} from '../colors';
import useHover from '../hooks/useHover';

export function Instance({data, selected}) {
  const [hoverRef, isHovered] = useHover();

  const styles = {
    container: {
      padding: 10,
      backgroundColor: isHovered ? primary3 : selected ? primary45 : '#FFF',
      color: isHovered || selected ? '#FFF' : primary4,
      border: `1px solid ${primary3}`,
      borderRadius: 4,
      marginBottom: 4,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'Open Sans',
    },
    address: {
      marginLeft: 10,
      fontSize: 14,
    }
  };

  const {name, address} = data;

  return (
    <div ref={hoverRef} style={styles.container}>
      <div>{name}</div>
      <div style={styles.address}>{address}</div>
    </div>
  );
}
