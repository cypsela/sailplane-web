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
  defaultColor,
  id,
}) {
  const [hoverRef, isHovered] = useHover();
  const [tooltipRef, tooltipDimenstions] = useDimensions();
  const IconComponent = iconComponent;
  const tooltipWidth = tooltipDimenstions.width ? tooltipDimenstions.width : 0;

  if (!defaultColor) {
    defaultColor = primary4;
  }

  if (!changeColor) {
    changeColor = errorColor;
  }

  const styles = {
    container: {
      position: 'relative',
      display: 'inline-block',
      cursor: 'pointer',
      padding: 4,
      fontSize: 14,
    },
    popover: {
      position: 'absolute',
      top: -30,
      backgroundColor: primary3,
      color: '#FFF',
      padding: '4px 6px',
      borderRadius: 2,
      left: -(tooltipWidth / 2) + 8,
      fontSize: 14,
      fontWeight: 400,
      zIndex: 1000,
    },
    title: {
      textDecoration: isHovered ? 'underline' : 'none',
      fontSize: 13,
      color: primary,
    },
  };

  return (
    <div
      id={id}
      style={styles.container}
      ref={hoverRef}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}>
      {iconComponent ? (
        <IconComponent
          color={isHovered ? changeColor : defaultColor}
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
