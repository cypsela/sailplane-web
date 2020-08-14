import React, {useEffect, useRef, useState} from 'react';
import {Dialog} from './Dialog';
import {primary, primary15, primary3, primary45} from '../utils/colors';
import {driveName} from '../utils/sailplane-util';
import {setInstanceLabel} from '../actions/main';
import {useDispatch} from 'react-redux';
import {BigButton} from './BigButton';

export default function LabelDriveDialog({
  onClose,
  isVisible,
  instance,
  instanceIndex,
}) {
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState(instance.label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      inputRef.current.focus();
      inputRef.current.select();
    } else {
      setNickname(instance.label);
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
  };

  const doLabel = () => {
    dispatch(setInstanceLabel(instanceIndex, nickname));
    onClose();
  };

  return (
    <Dialog
      backgroundColor={primary15}
      isVisible={isVisible}
      title={`Set nickname for ${driveName(instance.address)}`}
      body={
        <div style={styles.body}>
          <div style={styles.title}>Nickname:</div>

          <input
            ref={inputRef}
            type={'text'}
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            autoCorrect={'off'}
            style={styles.input}
            placeholder={`(ex: Work sketches)`}
            className={'textInput'}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                doLabel();
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
              title={'Confirm'}
              onClick={doLabel}
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
