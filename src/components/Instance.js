import React from 'react';
import {errorColor, primary, primary2, primary3, primary45} from '../colors';
import useHover from '../hooks/useHover';
import {ToolItem} from './ToolItem';
import {FiShare2, FiCopy, FiTrash} from 'react-icons/fi';
import {useElementCopy} from '../hooks/useElementCopy';
import {FiHardDrive, FiUsers} from 'react-icons/fi/index';

export const Instance = React.memo(
  ({data, selected, onClick, onDelete, instanceIndex}) => {
    const [hoverRef, isHovered] = useHover();
    const [elementToCopy1, doCopy1] = useElementCopy({
      message: 'Copied drive url',
    });
    const [elementToCopy2, doCopy2] = useElementCopy({
      message: 'Copied drive address',
    });

    const {name, address, isImported} = data;

    let backgroundColor = selected ? primary3 : '#FFF';

    const styles = {
      outer: {
        padding: 6,
        backgroundColor: backgroundColor,
        border: `1px solid ${primary3}`,
        borderTop: instanceIndex === 0 ? `1px solid ${primary2}` : 0,
        borderBottom: `1px solid ${primary2}`,
        borderRight: 0,
        borderLeft: 0,
        color: selected ? '#fff' : primary45,
        paddingTop: 12,
        fontFamily: 'Open Sans',
        cursor: 'pointer',
        borderRadius: 3,
      },
      container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      address: {
        fontSize: 14,
        overflow: 'hidden',
        width: '40%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
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
        display: 'flex',
        alignItems: 'center',
      },
      icon: {
        marginRight: 4,
      },
      importedTxt: {
        marginLeft: 6,
        fontSize: 14,
      },
    };

    const addressId = `instance-${address}`;
    const shareURL = `${
      window.location.origin + window.location.pathname
    }#/importInstance/${encodeURIComponent(address)}`;

    return (
      <div
        className={'drive'}
        style={styles.outer}
        ref={hoverRef}
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}>
        <div style={styles.container}>
          <div style={styles.name}>
            <FiHardDrive
              className={'shareIcon'}
              color={selected ? '#FFF' : primary45}
              size={15}
              style={styles.icon}
            />
            {name}
            {isImported ? (
              <span style={styles.importedTxt}>[imported]</span>
            ) : null}
          </div>
          <div id={addressId} style={styles.address}>
            <span ref={elementToCopy1}>{shareURL}</span>
            <br />
            <span ref={elementToCopy2}>{address}</span>
          </div>
        </div>
        <div style={styles.tools}>
          <div style={styles.toolItem}>
            <ToolItem
              defaultColor={selected ? '#fff' : primary45}
              iconComponent={FiShare2}
              size={15}
              changeColor={primary}
              onClick={doCopy1}
            />
          </div>
          <div style={styles.toolItem}>
            <ToolItem
              defaultColor={selected ? '#fff' : primary45}
              iconComponent={FiCopy}
              size={15}
              changeColor={primary}
              onClick={doCopy2}
            />
          </div>
          <div style={styles.toolItem}>
            <ToolItem
              className={'instanceDelete'}
              defaultColor={selected ? '#fff' : primary45}
              iconComponent={FiTrash}
              size={15}
              changeColor={errorColor}
              onClick={() => onDelete()}
            />
          </div>
        </div>
      </div>
    );
  },
);
