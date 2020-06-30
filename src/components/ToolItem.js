import React from 'react';
import {errorColor, primary4} from '../colors';
import useHover from '../hooks/useHover';

export function ToolItem({iconComponent, onClick, size, changeColor}) {
  const [hoverRef, isHovered] = useHover();
  const IconComponent = iconComponent;

  if (!changeColor) {
    changeColor = errorColor;
  }

  const styles = {
    container: {
      display: 'inline-block',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container} ref={hoverRef} onClick={onClick}>
      <IconComponent
        color={isHovered ? changeColor : primary4}
        size={size ? size : 16}
        style={styles.icon}
      />
    </div>
  );
}
