import React from 'react';
import {primary45} from '../utils/colors';
import useHover from '../hooks/useHover';
import {FiHardDrive, FiLock, FiUnlock} from 'react-icons/fi';

export function SmallInstanceItem({data, onClick}) {
  const [hoverRef, isHovered] = useHover();
  const {name, isEncrypted, label} = data;
  const LockComponent = isEncrypted ? FiLock : FiUnlock;

  const styles = {
    container: {
      backgroundColor: isHovered ? primary45 : '#FFF',
      color: isHovered ? '#FFF' : primary45,
      padding: '6px 6px',
      display: 'flex',
      alignItems: 'center',
      minWidth: name.length * 9,
      zIndex: 200,
    },
    icon: {
      marginRight: 4,
    },
  };
  return (
    <div
      className={'smallInstanceItem'}
      style={styles.container}
      ref={hoverRef}
      onClick={onClick}>
      <FiHardDrive color={isHovered ? '#FFF' : primary45} size={16} style={styles.icon} />
      <LockComponent
        color={isHovered ? '#FFF' : primary45}
        size={14}
        style={styles.icon}
      />

      {label || name}
    </div>
  );
}
