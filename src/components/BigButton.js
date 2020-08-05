import React from 'react';
import {primary45} from '../utils/colors';
import useHover from '../hooks/useHover';

export function BigButton({title, onClick, inverted, fullWidth}) {
  const [hoverRef, isHovered] = useHover();


  let initialBg = null;
  let hoverBg = primary45;

  let initialColor = null;
  let hoverColor = '#FFF';


  if (inverted) {
    initialBg = primary45;
    hoverBg = null;
    initialColor = '#FFF';
    hoverColor = null;
  }

  const styles = {
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth? '100%': null,
      backgroundColor: isHovered ? hoverBg : initialBg,
      color: isHovered ? hoverColor : initialColor,
      borderRadius: 4,
      padding: '6px 8px',
      border: `1px solid ${primary45}`,
      cursor: 'pointer',
      userSelect: 'none',
      boxSizing: 'border-box'
    },
  };

  return (
    <div ref={hoverRef} style={styles.container} onClick={onClick}>
      {title}
    </div>
  );
}
