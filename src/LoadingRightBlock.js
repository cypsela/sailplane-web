import React from 'react';
import {primary4} from './colors';
import {isWebRTCSupported} from './utils/Utils';
import {FiLoader} from 'react-icons/fi/index';

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
    boxSizing: 'border-box',
  },
  icon: {
    marginRight: 4,
  },
};

export function LoadingRightBlock({ipfsError, message}) {
  if (!message) {
    message = 'Loading...';
  }

  return (
    <div style={styles.container}>
      {isWebRTCSupported && !ipfsError ? (
        <div>
          <FiLoader
            color={primary4}
            size={16}
            style={styles.icon}
            className={'rotating'}
          />
          {message}
        </div>
      ) : (
        <div>
          This browser does not support WebRTC, iOS users please try Safari.
        </div>
      )}
    </div>
  );
}
