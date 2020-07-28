import React from 'react';
import {primary45} from '../utils/colors';
import useHover from '../hooks/useHover';

export function SmallInstanceItem({name, onClick}) {
  const [hoverRef, isHovered] = useHover();

  const styles = {
    container: {
      backgroundColor: isHovered ? primary45 : '#FFF',
      color: isHovered ? '#FFF' : primary45,
      padding: '6px 10px',
      display: 'block',
      minWidth: name.length * 7.5,
      zIndex: 200,
    },
  };
  return (
    <div
      className={'smallInstanceItem'}
      style={styles.container}
      ref={hoverRef}
      onClick={onClick}>
      {name}
    </div>
  );
}
