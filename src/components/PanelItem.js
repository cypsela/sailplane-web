import React from 'react';

export function PanelItem({selected, onClick, title, icon}) {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 14,
      cursor: 'pointer',
      fontWeight: selected ? '600' : '400',
      letterSpacing: 1.5,
    },
    title: {
      marginRight: 4,
    },
  };
  return (
    <div style={styles.container} onClick={onClick}>
      <span style={styles.title}>{title}</span>
      {icon}
    </div>
  );
}
