import {FiFolder, FiFile, FiMusic, FiVideo} from 'react-icons/fi/index';
import {primary45} from '../colors';
import React from 'react';

const styles ={
  container: {
    marginTop: 12,
  },
  icon: {
    padding: 6,
  }
};

export function DragBlock() {
  return (
    <div style={styles.container}>
      <div>
        <FiFile color={primary45} size={18} style={styles.icon} />
        <FiMusic color={primary45} size={18} style={styles.icon} />
        <FiVideo color={primary45} size={18} style={styles.icon} />
        <FiFolder color={primary45} size={18} style={styles.icon} />
      </div>
      <div>drag files to upload</div>
    </div>
  );
}
