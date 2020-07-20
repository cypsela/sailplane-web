import {FiFolder, FiMusic, FiVideo, FiImage} from 'react-icons/fi/index';
import {primary2, primary3, primary45} from '../colors';
import React from 'react';
import {useIsMobile} from '../hooks/useIsMobile';

export function FileDragBlock({handleOpenUpload, isActive}) {
  const isMobile = useIsMobile();
  const uploadTitle = isMobile
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
              className={'jumping'}
              style={{...styles.iconContainer, animationDelay: '2s'}}>
              <FiImage color={iconColor} size={20} style={{...styles.icon}} />
            </div>
            <div
              className={'jumping'}
              style={{...styles.iconContainer, animationDelay: '2.25s'}}>
              <FiFolder color={iconColor} size={20} style={{...styles.icon}} />
            </div>
            <div
              className={'jumping'}
              style={{...styles.iconContainer, animationDelay: '2.5s'}}>
              <FiMusic color={iconColor} size={20} style={{...styles.icon}} />
            </div>
            <div
              className={'jumping'}
              style={{...styles.iconContainer, animationDelay: '2.75s'}}>
              <FiVideo color={iconColor} size={20} style={{...styles.icon}} />
            </div>
          </div>
          <div style={styles.dragTitle}>
            {!isActive ? uploadTitle : 'Drop your files here!'}
          </div>
        </div>
      </div>
    </div>
  );
}
