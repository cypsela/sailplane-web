import {FiFolder, FiMusic, FiVideo, FiImage} from 'react-icons/fi/index';
import {primary3} from '../colors';
import React from 'react';

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
  return (
    <div style={styles.container} onClick={handleOpenUpload}>
      <div>
        <div style={{...styles.iconContainer, transform: 'rotate(-20deg)'}}>
          <FiImage color={primary3} size={20} style={{...styles.icon}} />
        </div>
        <div style={{...styles.iconContainer, transform: 'rotate(10deg)'}}>
          <FiFolder color={primary3} size={20} style={{...styles.icon}} />
        </div>
        <div style={{...styles.iconContainer, transform: 'rotate(-10deg)'}}>
          <FiMusic color={primary3} size={20} style={{...styles.icon}} />
        </div>
        <div style={{...styles.iconContainer, transform: 'rotate(30deg)'}}>
          <FiVideo color={primary3} size={20} style={{...styles.icon}} />
        </div>
      </div>
      <div style={styles.dragTitle}>Drag files to upload or click here</div>
    </div>
  );
}
