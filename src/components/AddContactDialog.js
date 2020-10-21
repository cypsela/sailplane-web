import React, {useEffect, useRef, useState} from 'react';
import {Dialog} from './Dialog';
import {primary, primary15, primary3, primary45} from '../utils/colors';
import {addContact} from '../actions/main';
import {useDispatch} from 'react-redux';
import {BigButton} from './BigButton';
import Well from './Well';
import {FaQrcode} from 'react-icons/fa';
import QRScanDialog from './QRScanDialog';
import {isCameraSupported, publicKeyValid} from '../utils/Utils';
import useIsCameraAvailable from '../hooks/useIsCameraAvailable';

export default function AddContactDialog({onClose, isVisible, contacts, myID}) {
  const dispatch = useDispatch();

  const existingIds = contacts ? [myID, ...contacts.map((c) => c.pubKey)] : [];

  const [label, setLabel] = useState('');
  const [pubKey, setPubKey] = useState('');
  const [error, setError] = useState(null);
  const [isQRScanModalVisible, setIsQRScanModalVisible] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      inputRef.current.focus();
      inputRef.current.select();
    } else {
      setPubKey('');
      setLabel('');
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const styles = {
    title: {
      fontSize: 16,
      color: primary45,
      marginBottom: 8,
    },

    labelTitle: {
      marginTop: 12,
      marginBottom: 4,
    },

    input: {
      border: `1px solid ${primary3}`,
      borderRadius: 4,
      color: primary,
      fontSize: 14,
      fontWeight: 200,
      padding: 4,
      display: 'inline-flex',
      width: '100%',
      boxSizing: 'border-box',
    },
    confirmBlock: {
      marginTop: 14,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    cancel: {
      marginRight: 8,
    },
    optional: {
      position: 'relative',
      top: -8,
      left: 4,
      fontSize: 13,
    },
    inputIconContainer: {

    },
    inputIcon: {
      display: 'flex',
      alignItems: 'center',
      // height: '100%',
      position: 'absolute',
      right: 8,
      cursor: 'pointer',
      backgroundColor: '#FFF',
    },
    inputWrapper: {
      display: 'flex',
      flexGrow: 2,
      position: 'relative',
      alignItems: 'center',
    },
  };

  const createContact = () => {
    if (!publicKeyValid(pubKey)) {
      setError('Invalid user ID');
    } else if (existingIds.includes(pubKey)) {
      setError('Contact already exists');
    } else {
      dispatch(addContact(pubKey, label));
      onClose();
    }
  };

  return (
    <Dialog
      backgroundColor={primary15}
      isVisible={isVisible}
      title={'Add contact'}
      body={
        <div style={styles.body}>
          {error ? <Well isError={true}>{error}</Well> : null}
          <div style={styles.title}>User ID:</div>

          <div style={styles.inputWrapper}>
            <input
              ref={inputRef}
              type={'text'}
              value={pubKey}
              onChange={(event) => setPubKey(event.target.value)}
              autoCorrect={'off'}
              style={styles.input}
              placeholder={`(ex: 0356467b31...)`}
              className={'textInput'}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  createContact();
                }
              }}
            />
            <FaQrcode
              onClick={() => setIsQRScanModalVisible(true)}
              color={primary45}
              size={16}
              style={styles.inputIcon}
            />
          </div>

          <div style={{...styles.title, ...styles.labelTitle}}>
            Name
            <span style={styles.optional}>(optional)</span>
          </div>

          <input
            type={'text'}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            autoCorrect={'off'}
            style={styles.input}
            placeholder={`(ex: John Richardson)`}
            className={'textInput'}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                createContact();
              }
            }}
          />

          <div style={styles.confirmBlock}>
            <BigButton
              title={'Cancel'}
              inverted={false}
              noHover={true}
              customWhiteColor={primary15}
              style={styles.cancel}
              onClick={onClose}
            />
            <BigButton
              id={'addContactDialogButton'}
              title={'Add contact'}
              onClick={createContact}
              inverted={true}
              customWhiteColor={primary15}
            />
          </div>
          <QRScanDialog
            isVisible={isQRScanModalVisible}
            onClose={() => setIsQRScanModalVisible(false)}
            onScan={(userID)=>{
              setPubKey(userID);
              setIsQRScanModalVisible(false);
            }}
          />
        </div>
      }
      onClose={onClose}
    />
  );
}
