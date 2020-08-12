import React from 'react';
import {primary3} from '../utils/colors';

export function Pill({title, inverted}) {
  const styles = {
    container: {
      backgroundColor: inverted ? '#FFF' : primary3,
      fontSize: 13,
      padding: '1px 4px',
      borderRadius: 4,
      marginRight: 4,
      width: 46,
      textAlign: 'center',
      color: inverted ? primary3 : '#FFF',
      flexShrink: 0,
    },
  };
  return <div style={styles.container}>{title}</div>;
}
