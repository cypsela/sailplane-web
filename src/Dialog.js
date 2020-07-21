import React from 'react';
import {primary45} from './colors';
import {FaTimes} from 'react-icons/fa';
import {useIsMobile} from './hooks/useIsMobile';

export function Dialog({isVisible, body, onClose, title}) {
  const isMobile = useIsMobile();

  if (!isVisible) {
    return null;
  }

  const styles = {
    container: {
      position: isMobile ? 'fixed' : 'absolute',
      backgroundColor: '#FFF',
      border: `1px solid ${primary45}`,
      borderRadius: 4,
      top: 150,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      fontFamily: 'Open Sans',
      zIndex: 10000,
      boxShadow: '0 0px 14px hsla(0, 0%, 0%, 0.2)',
    },
    header: {
      backgroundColor: primary45,
      color: '#FFF',
      padding: 8,
      fontSize: 14,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    body: {
      padding: 14,
    },
    xIcon: {
      cursor: 'pointer',
    },
    background: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: '#00000033',
    },
  };

  return (
    <div style={styles.outer}>
      <div style={styles.background} onClick={onClose} />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>{title}</div>
          <FaTimes
            color={'#FFF'}
            size={16}
            style={styles.xIcon}
            onClick={onClose}
          />
        </div>
        <div style={styles.body}>{body}</div>
      </div>
    </div>
  );
}
