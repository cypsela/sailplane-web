import React from 'react';
import {Modal} from './Modal';
import {primary15, primary4} from '../utils/colors';
import intro1 from '../imgs/intro1-2.png';
import InfoItem from './InfoItem';
import {BigButton} from './BigButton';
import {useIsSmallScreen} from '../hooks/useIsSmallScreen';

export function IntroModal({isVisible, onClose}) {
  const isSmallScreen = useIsSmallScreen();

  const styles = {
    container: {
      display: isSmallScreen ? 'block' : 'flex',
      justifyContent: 'space-between',
      backgroundColor: primary15,
      color: primary4,
      fontFamily: 'Open Sans',
      padding: 12,
      overflow: 'hidden',
    },
    title: {
      fontSize: 24,
      fontWeight: 600,
    },
    subTitle: {
      marginTop: 8,
      marginBottom: 12,
    },
    image: {
      width: 300,
      borderRadius: 8,
      boxShadow: '0 0px 14px hsla(0, 0%, 0%, 0.2)',
    },
    imageContainer: {
      display: isSmallScreen ? 'none' : null,
      position: 'relative',
      height: 300,
      width: 300,
    },
    left: {
      padding: 10,
      paddingRight: 40,
    },
    modal: {
      maxWidth: 800,
    },
    bold: {
      fontWeight: 600,
    },
    buttons: {
      marginTop: 30,
    },
  };

  return (
    <Modal isVisible={isVisible} style={styles.modal}>
      <div style={styles.container}>
        <div style={styles.left}>
          <div style={styles.title}>Share files for free. No limits.</div>
          <div style={styles.subTitle}>
            Why pay for a service to transfer and share files when you can use
            modern <span style={styles.bold}>p2p</span> technology and cut out
            the <span style={styles.bold}>middle men?</span>
          </div>
          <div style={styles.items}>
            <InfoItem title={'Share any type or size files'} />
            <InfoItem title={'Collaborate with others with shared folders'} />
            <InfoItem title={'Multiple drives for different occasions'} />
            <InfoItem title={'Sharing operates from device to device'} />
          </div>
          <div style={styles.buttons}>
            <BigButton title={'Start sharing'} onClick={onClose} />
          </div>
        </div>
        <div style={styles.imageContainer}>
          <img style={styles.image} src={intro1} alt="Intro image 1" />
        </div>
      </div>
    </Modal>
  );
}
