import React from 'react';
import {primary45} from '../colors';
import {FaTimes} from 'react-icons/fa';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';
import {Modal} from './Modal';

export function Dialog({isVisible, body, onClose, title, noPadding}) {
  const isSmallScreen = useIsSmallScreen();

  if (!isVisible) {
    return null;
  }

  const styles = {
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
      padding: noPadding ? 0 : 14,
    },
    xIcon: {
      cursor: 'pointer',
    },
  };

  return (
    <Modal onClose={onClose}>
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
    </Modal>
  );
}
