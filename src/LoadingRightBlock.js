import React from 'react';
import {primary4} from "./colors";

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
  return <div style={styles.container}>Loading...</div>;
}
