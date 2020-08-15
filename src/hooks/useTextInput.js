import React, {useEffect, useRef, useState} from 'react';
import {ToolItem} from '../components/ToolItem';
import {
  errorColor,
  goodColor,
  primary,
  primary3,
  primary4,
  primary45,
} from '../utils/colors';

export default function useTextInput(
  visible,
  handleDone,
  handleCancel,
  initialValue,
  {
    placeholder,
    isPassword,
    isError,
    confirmTitle,
    inputIconComponent,
    onInputIconClick,
  },
) {
  const [inputString, setInputString] = useState(initialValue);
  const [showRedBorder, setShowRedBorder] = useState(false);
  const IconComponent = inputIconComponent;
  const inputRef = useRef(null);

  const checkIfError = async () => {
    const tmpIsError = await isError(inputString);
    setShowRedBorder(tmpIsError);
  };

  useEffect(() => {
    if (isError) {
      checkIfError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputString]);

  const styles = {
    input: {
      border: `1px solid ${
        showRedBorder ? errorColor : isError ? goodColor : primary3
      }`,
      borderRadius: 4,
      color: primary,
      fontSize: 14,
      fontWeight: 200,
      padding: 4,
      marginRight: 4,
      display: 'inline-flex',
      flexGrow: 2,
    },
    inputWrapper: {
      display: 'inline-flex',
      flexGrow: 2,
      position: 'relative',
    },
    acceptButton: {
      backgroundColor: primary3,
      color: '#FFF',
      fontSize: 12,
      padding: '4px 5px',
      borderRadius: 2,
      cursor: 'pointer',
      zIndex: 2,
    },
    inputIcon: {
      display: 'flex',
      alignItems: 'center',
      height: 26,
      position: 'absolute',
      right: 8,
      cursor: 'pointer',
    },
  };

  useEffect(() => {
    if (visible) {
      inputRef.current.focus();
      inputRef.current.select();
    } else {
      setInputString(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      <div style={styles.inputWrapper}>
        <input
          ref={inputRef}
          className={'textInput'}
          type={isPassword ? 'password' : 'text'}
          placeholder={placeholder}
          style={styles.input}
          value={inputString}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => setInputString(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleDone(inputString);
            }
          }}
        />
        {inputIconComponent ? (
          <IconComponent
            onClick={onInputIconClick}
            color={primary45}
            size={16}
            style={styles.inputIcon}
          />
        ) : null}
      </div>

      <div
        onClick={(event) => {
          event.stopPropagation();
          handleDone(inputString);
        }}
        style={styles.acceptButton}>
        {confirmTitle ? confirmTitle : 'Accept'}
      </div>
      {handleCancel ? (
        <ToolItem
          title={'Cancel'}
          onClick={() => handleCancel()}
          changeColor={primary4}
        />
      ) : null}
    </>
  );
}
