import React from 'react';
import {FiCheckCircle} from 'react-icons/fi';
import {primary45} from '../utils/colors';

const styles = {
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    width: 16,
    height: 16,
    flexShrink: 0,
  }
};

export default function InfoItem({title}) {
  return (
    <div style={styles.infoItem}>
      <FiCheckCircle color={primary45} size={16} style={styles.icon} />
      <span>{title}</span>
    </div>
  );
}
