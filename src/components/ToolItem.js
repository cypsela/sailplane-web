import React from 'react';
import {errorColor, primary4} from '../colors';
import useHover from '../hooks/useHover';

export function ToolItem({iconComponent, onClick}) {
  const [hoverRef, isHovered] = useHover();
  const IconComponent = iconComponent;

  const styles = {
    container: {
      display: 'inline-block',
    },
  };

  return (
    <div style={styles.container} ref={hoverRef} onClick={onClick}>
      <IconComponent
        color={isHovered ? errorColor : primary4}
        size={16}
        style={styles.icon}
      />
    </div>
  );
}
