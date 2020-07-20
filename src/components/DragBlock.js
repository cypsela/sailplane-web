import {FiFolder, FiMusic, FiVideo, FiImage} from 'react-icons/fi/index';
import {primary3} from '../colors';
import React from 'react';
import {useIsMobile} from '../hooks/useIsMobile';

const styles = {
  container: {
    marginTop: 12,
    border: `2px dashed ${primary3}`,
    borderRadius: 4,
    padding: 18,
  },
  icon: {
    padding: 6,
  },
  dragTitle: {
    color: primary3,
    fontSize: 16,
    fontWeight: 400,
  },
  iconContainer: {
    display: 'inline-block',
  },
};

export function DragBlock({handleOpenUpload}) {
  const isMobile = useIsMobile();
  const uploadTitle = isMobile
    ? 'Tap to upload files'
    : 'Drag files to upload or click here';
  return (
    <div style={styles.container} onClick={handleOpenUpload}>
      <div>
        <div
          className={'jumping'}
          style={{...styles.iconContainer, animationDelay: '2s'}}>
          <FiImage color={primary3} size={20} style={{...styles.icon}} />
        </div>
        <div
          className={'jumping'}
          style={{...styles.iconContainer, animationDelay: '2.25s'}}>
          <FiFolder color={primary3} size={20} style={{...styles.icon}} />
        </div>
        <div
          className={'jumping'}
          style={{...styles.iconContainer, animationDelay: '2.5s'}}>
          <FiMusic color={primary3} size={20} style={{...styles.icon}} />
        </div>
        <div
          className={'jumping'}
          style={{...styles.iconContainer, animationDelay: '2.75s'}}>
          <FiVideo color={primary3} size={20} style={{...styles.icon}} />
        </div>
      </div>
      <div style={styles.dragTitle}>{uploadTitle}</div>
    </div>
  );
}
