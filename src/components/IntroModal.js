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
      color: primary4,
      fontFamily: 'Open Sans',
      padding: 12,
      overflow: 'hidden',
    },
    title: {
      fontSize: 23,
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
      padding: '4px 10px',
      paddingRight: 40,
    },
    modal: {
      maxWidth: 800,
      backgroundColor: primary15,
      borderRadius: 8,
    },
    bold: {
      fontWeight: 600,
    },
    buttons: {
      marginTop: 18,
    },
  };

  return (
    <Modal isVisible={isVisible} style={styles.modal}>
      <div style={styles.container}>
        <div style={styles.left}>
          <div style={styles.title}>
            Share files for free. <br /> No sign up needed :)
          </div>
          <div style={styles.subTitle}>
            Upload files to private file <span style={styles.bold}>drives</span>
            . Share drive access with friends so they can upload too!
          </div>
          <div style={styles.items}>
            <InfoItem title={'Upload any type of file'} />
            <InfoItem title={'Collaborate with others in shared drives'} />
            <InfoItem
              title={'Create multiple drives for different occasions'}
            />
            <InfoItem
              title={
                'Files are stored in, and shared directly between browsers'
              }
            />
            <InfoItem title={'Works best with small to medium sized files'} />
          </div>
          <div style={styles.buttons}>
            <BigButton title={'Open drive'} onClick={onClose} />
          </div>
        </div>
        <div style={styles.imageContainer}>
          <img style={styles.image} src={intro1} alt="Intro image 1" />
        </div>
      </div>
    </Modal>
  );
}
