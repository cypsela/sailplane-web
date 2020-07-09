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

export function LoadingRightBlock() {
  return (
    <div style={styles.container}>
      {isWebRTCSupported ? (
        <div>Loading...</div>
      ) : (
        <div>This browser does not support WebRTC, please try Safari.</div>
      )}
    </div>
  );
}
