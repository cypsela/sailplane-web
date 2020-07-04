import React from 'react';
import {errorColor, primary2, primary3, primary4, primary45} from '../colors';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';
import {FiTrash} from 'react-icons/fi';

export function Instance({data, selected, onClick, onDelete}) {
  const [hoverRef, isHovered] = useHover();
  const {name, address} = data;

  let backgroundColor = selected ? primary3 : primary2;

  const styles = {
    outer: {
      padding: 8,
      backgroundColor: backgroundColor,
      border: `1px solid ${isHovered?primary3:backgroundColor}`,
      color: selected ? '#FFF' : primary45,
      borderRadius: 4,
      marginBottom: 4,
      fontFamily: 'Open Sans',
    },
    container: {
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    address: {
      marginLeft: 10,
      fontSize: 14,
      overflow: 'hidden',
    },
    tools: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 10,
    },
    name: {
      fontSize: 20,
    },
  };

  return (
    <div
      style={styles.outer}
      ref={hoverRef}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}>
      <div style={styles.container}>
        <div style={styles.name}>{name}</div>
        <div style={styles.address}>{address}</div>
      </div>
      <div style={styles.tools}>
        <ToolItem
          defaultColor={selected ? primary2 : primary45}
          iconComponent={FiTrash}
          size={16}
          changeColor={errorColor}
          onClick={() => onDelete()}
        />
      </div>
    </div>
  );
}
