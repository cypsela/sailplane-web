import React from 'react';
import {primary45} from '../utils/colors';
import useHover from '../hooks/useHover';

export function BigButton({
  title,
  onClick,
  inverted,
  fullWidth,
  customFillColor,
  customWhiteColor,
  style,
  noHover,
  id,
}) {
  const [hoverRef, isHovered] = useHover();

  const fillColor = customFillColor || primary45;
  const whiteColor = customWhiteColor || '#FFF';

  let initialBg = null;
  let hoverBg = fillColor;

  let initialColor = fillColor;
  let hoverColor = whiteColor;

  if (inverted) {
    initialBg = fillColor;
    hoverBg = null;
    initialColor = whiteColor;
    hoverColor = fillColor;
  }

  const styles = {
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : null,
      backgroundColor: isHovered && !noHover ? hoverBg : initialBg,
      color: isHovered && !noHover ? hoverColor : initialColor,
      borderRadius: 4,
      padding: '6px 8px',
      border: `1px solid ${fillColor}`,
      cursor: 'pointer',
      userSelect: 'none',
      boxSizing: 'border-box',
    },
  };

  return (
    <div
      id={id}
      ref={hoverRef}
      style={{...styles.container, ...style}}
      onClick={onClick}>
      {title}
    </div>
  );
}
