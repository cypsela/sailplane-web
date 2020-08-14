import React from 'react';
import {
  cleanBorder,
  lightErrorColor,
  primary15,
  primary4,
} from '../utils/colors';

export default function Well({children, isError}) {
  const styles = {
    container: {
      backgroundColor: isError ? lightErrorColor : primary15,
      color: isError ? '#FFF' : primary4,
      fontSize: 14,
      padding: 6,
      borderRadius: 4,
      marginBottom: 8,
      border: cleanBorder,
    },
  };

  return <div style={styles.container}>{children}</div>;
}
