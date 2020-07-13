import React from 'react';
import {errorColor, primary, primary2, primary3, primary45} from '../colors';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';
import {FiCopy, FiTrash} from 'react-icons/fi';
import {useElementCopy} from '../hooks/useElementCopy';
import {FiHardDrive} from 'react-icons/fi/index';

export const Instance = React.memo(({data, selected, onClick, onDelete}) => {
  const [hoverRef, isHovered] = useHover();
  const [elementToCopy, doCopy] = useElementCopy({
    message: 'Instance address copied',
  });

  const {name, address} = data;

  let backgroundColor = selected ? primary3 : primary2;

  const styles = {
    outer: {
      padding: 6,
      backgroundColor: backgroundColor,
      border: `1px solid ${isHovered ? primary3 : backgroundColor}`,
      color: selected ? '#FFF' : primary45,
      borderRadius: 4,
      marginBottom: 4,
      fontFamily: 'Open Sans',
      cursor: 'pointer',
    },
    container: {
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
    toolItem: {
      marginLeft: 10,
    },
    name: {
      fontSize: 18,
      lineHeight: '19px',
      // fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      marginRight: 4,
    },
  };

  const addressId = `instance-${address}`;
  const shareURL = `${
    window.location.origin + window.location.pathname
  }#/importInstance/${encodeURIComponent(address)}`;

  return (
    <div
      style={styles.outer}
      ref={hoverRef}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}>
      <div style={styles.container}>
        <div style={styles.name}>
          <FiHardDrive
            color={selected ? '#FFF' : primary45}
            size={16}
            style={styles.icon}
          />
          {name}
        </div>
        <div id={addressId} style={styles.address} ref={elementToCopy}>
          {shareURL}
        </div>
      </div>
      <div style={styles.tools}>
        <div style={styles.toolItem}>
          <ToolItem
            defaultColor={selected ? primary2 : primary45}
            iconComponent={FiCopy}
            size={16}
            changeColor={primary}
            onClick={doCopy}
          />
        </div>
        <div style={styles.toolItem}>
          <ToolItem
            className={'instanceDelete'}
            defaultColor={selected ? primary2 : primary45}
            iconComponent={FiTrash}
            size={16}
            changeColor={errorColor}
            onClick={() => onDelete()}
          />
        </div>
      </div>
    </div>
  );
});
