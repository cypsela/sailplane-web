import React from 'react';
import {primary3, primary45} from '../colors';

export function MobileActionItem({iconComponent, title, onClick, forceColor}) {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 80,
      marginTop: 10,
      marginBottom: 10,
    },
    inner: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      border: `1px solid ${forceColor || primary3}`,
      borderRadius: 4,
      boxShadow: '1px 2px 3px #e8e8e8',
    },
    title: {
      fontSize: 16,
      color: forceColor || primary45,
      marginTop: 4,
    },
  };

  const IconComponent = iconComponent;

  return (
    <div style={styles.container}>
      <div style={styles.inner} onClick={onClick}>
        <IconComponent color={forceColor || primary3} size={22} style={styles.icon} />
        <div style={styles.title}>{title}</div>
      </div>
    </div>
  );
}
