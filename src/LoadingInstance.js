import React from 'react';
import {primary4} from './colors';
import {isWebRTCSupported} from './utils/Utils';

const styles = {
  container: {
    padding: 10,
    backgroundColor: '#FFF',
    textAlign: 'center',
    width: '100%',
    paddingTop: 100,
    fontSize: 20,
    fontFamily: 'MuseoModerno',
    fontWeight: '300',
    color: primary4,
  },
};

export function LoadingInstance() {
  return (
    <div style={styles.container}>
      <div>Looking for instance...</div>
    </div>
  );
}
