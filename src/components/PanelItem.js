import React from 'react';
import {primary3, primary4} from '../colors';
import useHover from "../hooks/useHover";

export function PanelItem({selected, onClick, title, icon}) {
  const [hoverRef, isHovered] = useHover();

  const styles = {
    container: {
      backgroundColor: selected ? '#FFF' : isHovered?primary3:null,
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
    <div style={styles.container} onClick={onClick} ref={hoverRef}>
      {icon}
      <span style={styles.title}>{title}</span>
    </div>
  );
}
