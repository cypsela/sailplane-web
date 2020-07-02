import React from 'react';
import {primary4, primary45, primary46} from '../colors';
import useHover from '../hooks/useHover';

export function PanelItem({selected, onClick, title, iconComponent}) {
  const [hoverRef, isHovered] = useHover();
  const IconComponent = iconComponent;

  const styles = {
    container: {
      backgroundColor: selected ? '#FFF' : isHovered ? primary46 : null,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      fontSize: 14,
      cursor: 'pointer',
      padding: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
    title: {
      color: selected ? primary4 : '#FFF',
      // marginRight: 4,
    },
    icon: {
      marginRight: 4,
    },
  };
  return (
    <div style={styles.container} onClick={onClick} ref={hoverRef}>
      {iconComponent ? (
        <IconComponent
          color={selected ? primary45 : '#FFF'}
          size={12}
          style={styles.icon}
        />
      ) : null}
      <span style={styles.title}>{title}</span>
    </div>
  );
}
