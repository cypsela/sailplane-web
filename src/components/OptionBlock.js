import React from 'react';
import {primary16, primary3, primary4} from '../utils/colors';
import InfoItem from './InfoItem';
import {BigButton} from './BigButton';

export function OptionBlock({title, infos, onClick}) {
  const styles = {
    container: {
      padding: 8,
      width: '100%',
      boxSizing: 'border-box',
    },
    inner: {
      overflow: 'hidden',
      border: `1px solid ${primary3}`,
      borderRadius: 4,
    },
    title: {
      backgroundColor: primary16,
      padding: 8,
      color: primary4,
      fontWeight: 400,
      textAlign: 'center',
      borderBottom: `1px solid ${primary3}`,
      marginBottom: 8,
    },
    body: {
      color: primary4,
      padding: 12,
    },
    infos: {
      marginBottom: 16,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <div style={styles.title}>{title}</div>
        <div style={styles.body}>
          <div style={styles.infos}>
            {infos?.map((info) => (
              <InfoItem title={info} key={info} />
            ))}
          </div>

          <BigButton
            title={`Create ${title.toLowerCase()} drive`}
            inverted={true}
            fullWidth={true}
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
}
