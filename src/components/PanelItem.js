import React from 'react';

export function PanelItem({selected, onClick, title}) {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 14,
      cursor: 'pointer',
      fontWeight: selected? '600': '400',
      letterSpacing: 1.5
    },
  };
  return (
    <div style={styles.container} onClick={onClick}>
      {title}
    </div>
  );
}
