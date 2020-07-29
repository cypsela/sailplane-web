import React from 'react';
import {primary45} from '../utils/colors';
import useHover from '../hooks/useHover';

export function BigButton({title, onClick}) {
  const [hoverRef, isHovered] = useHover();

  const styles = {
    container: {
      display: 'inline-flex',
      backgroundColor: isHovered ? primary45 : null,
      color: isHovered ? '#FFF' : null,
      borderRadius: 4,
      padding: '6px 8px',
      border: `1px solid ${primary45}`,
      cursor: 'pointer',
      userSelect: 'none',
    },
  };

  return (
    <div ref={hoverRef} style={styles.container} onClick={onClick}>
      {title}
    </div>
  );
}
