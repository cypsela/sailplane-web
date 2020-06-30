import React from 'react';
import {FaChevronRight} from 'react-icons/fa';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 400,
    color: '#666',
  },
  icon: {
    marginRight: 4,
  },
};

export function Breadcrumb() {
  return (
    <div style={styles.container}>
      <FaChevronRight color={'#666'} size={16} style={styles.icon} /> /
    </div>
  );
}
