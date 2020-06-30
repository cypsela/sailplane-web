import React from 'react';

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
  },
};

export function LoadingRightBlock() {
  return <div style={styles.container}>Loading...</div>;
}
