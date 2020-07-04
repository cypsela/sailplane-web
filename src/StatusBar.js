import React from 'react';
import {primary45} from './colors';
import {FiLoader} from 'react-icons/fi';
import {useSelector} from 'react-redux';

export function StatusBar() {
  const status = useSelector((state) => state.tempData.status);
  const {message} = status;

  const styles = {
    container: {
      fontFamily: 'Open Sans',
      color: primary45,
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      height: 18,
      opacity: message ? 1 : 0,
    },
    message: {
      marginLeft: 4,
    },
  };

  return (
    <div style={styles.container}>
      <FiLoader
        color={primary45}
        size={16}
        style={styles.icon}
        className={'rotating'}
      />

      <span style={styles.message}>{message}</span>
    </div>
  );
}
