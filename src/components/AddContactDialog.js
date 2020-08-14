import React, {useEffect, useRef, useState} from 'react';
import {Dialog} from './Dialog';
import {primary, primary15, primary3, primary45} from '../utils/colors';
import {driveName} from '../utils/sailplane-util';
import {addContact, setInstanceLabel} from '../actions/main';
import {useDispatch} from 'react-redux';
import {BigButton} from './BigButton';
import {userPubValid} from '../utils/sailplane-access';
import Well from './Well';

export default function AddContactDialog({onClose, isVisible, contacts, myID}) {
  const dispatch = useDispatch();

  const existingIds = [myID, ...contacts.map(c => c.pubKey)]

  const [label, setLabel] = useState('');
  const [pubKey, setPubKey] = useState('');
  const [error, setError] = useState(null);

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
      marginRight: 4,
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
  };

  const createContact = () => {
    if (!userPubValid(pubKey)) {
      setError('Invalid user ID!');
    } else if (existingIds.includes(pubKey)) {
      setError('Contact already exists')
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

          <input
            ref={inputRef}
            type={'text'}
            value={pubKey}
            onChange={(event) => setPubKey(event.target.value)}
            autoCorrect={'off'}
            style={styles.input}
            placeholder={`(ex: 0356467b3149a95bcc25c16f25d882...)`}
            className={'textInput'}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                createContact();
              }
            }}
          />

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
              title={'Add contact'}
              onClick={createContact}
              inverted={true}
              customWhiteColor={primary15}
            />
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}
