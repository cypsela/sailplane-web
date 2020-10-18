import React from 'react';
import {primary4} from '../utils/colors';
import {isWebRTCSupported} from '../utils/Utils';
import {FiLoader} from 'react-icons/fi';

const styles = {
  container: {
    padding: 10,
    backgroundColor: '#FFF',
    textAlign: 'center',
    width: '100%',
    paddingTop: 100,
    fontSize: 20,
    fontFamily: 'Open Sans',
    fontWeight: '300',
    color: primary4,
    boxSizing: 'border-box',
    height: '100%',
  },
  icon: {
    marginRight: 4,
  },
};

export function LoadingRightBlock({ipfsError, message, loading}) {
  if (!message) {
    message = 'Loading...';
  }

  const loader = (
    <FiLoader
      color={primary4}
      size={16}
      style={styles.icon}
      className={'rotating'}
    />
  );

  const networkFail = <>
    Sailplane failed to start network. Try refreshing. <br/>
    If the problem persists you can try <a target="blank" href="https://intercom.help/scoutpad/en/articles/3478364-how-to-clear-local-storage-of-web-browser">clearing browser cache</a>.
  </>

  const failMessage = isWebRTCSupported()
    ?  networkFail
    : 'This browser does not support WebRTC, iOS users please try Safari.'

  return (
    <div style={styles.container}>
      {isWebRTCSupported() && !ipfsError ? (
        <div>
          {loading && loader}
          {message}
        </div>
      ) : (
        <div>
          {failMessage}
        </div>
      )}
    </div>
  );
}
