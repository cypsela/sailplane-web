import React from 'react';
import {errorColor, primary, primary3, primary4} from '../colors';
import useHover from '../hooks/useHover';
import useDimensions from 'react-use-dimensions';

export function ToolItem({
  iconComponent,
  onClick,
  size,
  changeColor,
  tooltip,
  title,
}) {
  const [hoverRef, isHovered] = useHover();
  const [tooltipRef, tooltipDimenstions] = useDimensions();
  const IconComponent = iconComponent;

  if (!changeColor) {
    changeColor = errorColor;
  }

  const styles = {
    container: {
      position: 'relative',
      display: 'inline-block',
      cursor: 'pointer',
      padding: 4,
    },
    popover: {
      position: 'absolute',
      top: -36,
      backgroundColor: primary4,
      color: '#FFF',
      padding: 8,
      borderRadius: 4,
      left: -(tooltipDimenstions.width / 2) + 8,
      fontSize: 14,
    },
    title: {
      textDecoration: isHovered ? 'underline' : 'none',
    },
  };

  return (
    <div style={styles.container} ref={hoverRef} onClick={onClick}>
      {iconComponent ? (
        <IconComponent
          color={isHovered ? changeColor : primary4}
          size={size ? size : 16}
          style={styles.icon}
        />
      ) : null}
      {title ? <span style={styles.title}>{title}</span> : null}
      {isHovered && tooltip ? (
        <div style={styles.popover} ref={tooltipRef}>
          {tooltip}
        </div>
      ) : null}
    </div>
  );
}
