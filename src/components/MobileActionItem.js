import React from 'react';
import {lightBorder, primary3, primary45} from '../utils/colors';

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
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      border: `1px solid ${forceColor || lightBorder}`,
      borderRadius: 4,
      boxShadow: '1px 2px 3px #e8e8e8',
    },
    title: {
      fontSize: 16,
      lineHeight: '16px',
      color: forceColor || primary45,
      marginTop: 4,
      whiteSpace: 'nowrap'
    },
    icon: {
      width: 40,
    },
    body: {
      display: 'flex',
      alignItems: 'center',
      width: 140,
    },
  };

  const IconComponent = iconComponent;

  return (
    <div style={styles.container}>
      <div style={styles.inner} onClick={onClick}>
        <div style={styles.body}>
          <IconComponent
            color={forceColor || primary3}
            size={19}
            style={styles.icon}
          />
          <div style={styles.title}>{title}</div>
        </div>
      </div>
    </div>
  );
}
