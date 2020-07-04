import React from 'react';
import {errorColor, primary3} from './colors';
import {FiLoader, FiAlertTriangle} from 'react-icons/fi';
import {useSelector} from 'react-redux';

export function StatusBar() {
  const status = useSelector((state) => state.tempData.status);
  const {message, isError} = status;

  const styles = {
    container: {
      position: 'fixed',
      bottom: 10,
      backgroundColor: primary3,
      padding: 8,
      borderRadius: 4,
      fontFamily: 'Open Sans',
      color: isError ? errorColor : '#FFF',
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

  let iconComponent = FiLoader;

  if (isError) {
    iconComponent = FiAlertTriangle;
  }

  const IconComponent = iconComponent;

  return (
    <div style={styles.container}>
      <IconComponent
        color={isError ? errorColor : '#FFF'}
        size={16}
        style={styles.icon}
        className={!isError ? 'rotating' : ''}
      />

      <span style={styles.message}>{message}</span>
    </div>
  );
}
