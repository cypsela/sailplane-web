import React from 'react';
import {primary45} from '../utils/colors';
import {FaTimes} from 'react-icons/fa';
import {Modal} from './Modal';

export function Dialog({
  isVisible,
  body,
  onClose,
  title,
  noPadding,
  backgroundColor,
  positionTop,
  style,
}) {
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
      backgroundColor: backgroundColor ? backgroundColor : '#FFF',
    },
    xIcon: {
      cursor: 'pointer',
    },
  };

  return (
    <Modal onClose={onClose} isVisible={isVisible} positionTop={positionTop} style={style}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>{title}</div>
          <FaTimes
            color={'#FFF'}
            size={16}
            style={styles.xIcon}
            className={'dialogClose'}
            onClick={onClose}
          />
        </div>
        <div style={styles.body}>{body}</div>
      </div>
    </Modal>
  );
}
