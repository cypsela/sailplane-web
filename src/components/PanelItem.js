import React from 'react';
import {primary4} from '../colors';

export function PanelItem({selected, onClick, title, icon}) {
  const styles = {
    container: {
      backgroundColor: selected ? '#FFF' : null,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      fontSize: 14,
      cursor: 'pointer',
      letterSpacing: 1.5,
      padding: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
    title: {
      color: selected ? primary4 : '#FFF',
      marginRight: 4,
    },
  };
  return (
    <div style={styles.container} onClick={onClick}>
      {icon}
      <span style={styles.title}>{title}</span>
    </div>
  );
}
