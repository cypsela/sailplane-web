import React from 'react';
import {
  cleanBorder,
  errorColor,
  primary2,
  primary3,
  primary35,
  primary45,
} from '../utils/colors';
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
  className,
  disabled,
}) {
  const [hoverRef, isHovered] = useHover();
  const [fullDimensionsRef, fullDimensions] = useDimensions();

  const [tooltipRef, tooltipDimensions] = useDimensions();
  const IconComponent = iconComponent;
  const tooltipWidth = tooltipDimensions.width ? tooltipDimensions.width : 0;

  if (!defaultColor) {
    defaultColor = primary3;
  }

  if (!changeColor) {
    changeColor = errorColor;
  }

  if (disabled) {
    defaultColor = '#DDD';
  }

  const styles = {
    container: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: 4,
      fontSize: 14,
    },
    popover: {
      position: 'fixed',
      top: fullDimensions.y - 40 || undefined,
      left: fullDimensions.x - (tooltipWidth / 2 - 8) || undefined,
      backgroundColor: primary3,
      color: '#FFF',
      padding: '4px 6px',
      border: cleanBorder,
      borderRadius: 2,
      fontSize: 14,
      fontWeight: 400,
      zIndex: 1000,
      pointerEvents: 'none',
    },
    title: {
      color: isHovered ? changeColor : defaultColor,
      marginLeft: 4,
      textDecoration: isHovered ? 'underline' : 'none',
      fontSize: 13,
      lineHeight: '16px',
      whiteSpace: 'nowrap',
    },
  };

  return (
    <div
      id={id}
      className={className}
      style={styles.container}
      ref={hoverRef}
      onClick={(event) => {
        event.stopPropagation();

        if (!disabled) {
          onClick();
        }
      }}>
      <div ref={fullDimensionsRef} />
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
