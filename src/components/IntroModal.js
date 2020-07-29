import React from 'react';
import {Modal} from './Modal';

export function IntroModal({isVisible, onClose}) {
  const styles = {
    container: {},
  };

  return (
    <Modal isVisible={isVisible}>
      <div style={styles.container}>Test</div>
    </Modal>
  );
}
