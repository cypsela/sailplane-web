import {FiFolder, FiMusic, FiVideo, FiImage} from 'react-icons/fi';
import {primary2, primary3, primary45} from '../utils/colors';
import React from 'react';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';

export function FileDragBlock({handleOpenUpload, isActive}) {
  const isSmallScreen = useIsSmallScreen();
  const uploadTitle = isSmallScreen
    ? 'Tap to upload files'
    : 'Drag files to upload or click here';

  const styles = {
    container: {
      border: `2px dashed ${primary3}`,
      backgroundColor: isActive ? primary2 : null,
      borderRadius: 4,
      padding: 18,
      height: isActive ? '100%' : null,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      padding: '0 6px',
    },
    dragTitle: {
      color: isActive ? primary45 : primary3,
      fontSize: 16,
      fontWeight: 400,
      marginTop: 2,
    },
    iconContainer: {
      display: 'inline-block',
    },
    outer: {
      paddingTop: 4,
      height: '100%',
      boxSizing: 'border-box',
    },
  };

  const iconColor = isActive ? primary45 : primary3;

  return (
    <div style={styles.outer}>
      <div
        style={styles.container}
        onClick={!isActive ? handleOpenUpload : null}>
        <div>
          <div>
            <div
              className={isActive ? 'jumpingDrop' : 'jumping'}
              style={{...styles.iconContainer, animationDelay: '.5s'}}>
              <FiImage color={iconColor} size={20} style={{...styles.icon}} />
            </div>
            <div
              className={isActive ? 'jumpingDrop' : 'jumping'}
              style={{...styles.iconContainer, animationDelay: '.75s'}}>
              <FiFolder color={iconColor} size={20} style={{...styles.icon}} />
            </div>
            <div
              className={isActive ? 'jumpingDrop' : 'jumping'}
              style={{...styles.iconContainer, animationDelay: '1s'}}>
              <FiMusic color={iconColor} size={20} style={{...styles.icon}} />
            </div>
            <div
              className={isActive ? 'jumpingDrop' : 'jumping'}
              style={{...styles.iconContainer, animationDelay: '1.25s'}}>
              <FiVideo color={iconColor} size={20} style={{...styles.icon}} />
            </div>
          </div>
          <div style={styles.dragTitle}>
            {!isActive ? uploadTitle : 'Drop to upload'}
          </div>
        </div>
      </div>
    </div>
  );
}
