import React from 'react';
import {FaChevronRight} from 'react-icons/fa';
import {primary4} from '../colors';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    marginBottom: 10,
    color: primary4,
    fontFamily: 'MuseoModerno',
    fontWeight: 600,
  },
  icon: {
    marginRight: 4,
  },
};

export function Breadcrumb() {
  return (
    <div style={styles.container}>
      <FaChevronRight color={primary4} size={16} style={styles.icon} /> /
    </div>
  );
}
