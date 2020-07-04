import React, {useEffect, useRef, useState} from 'react';
import {ToolItem} from '../components/ToolItem';
import {errorColor, goodColor, primary, primary3} from '../colors';

export default function useTextInput(
  visible,
  handleDone,
  handleCancel,
  initialValue,
  {placeholder, isPassword, isError},
) {
  const [inputString, setInputString] = useState(initialValue);
  const [showRedBorder, setShowRedBorder] = useState(false);

  const inputRef = useRef(null);

  const checkIfError = async () => {
    const tmpIsError = await isError(inputString);
    setShowRedBorder(tmpIsError);
  };

  useEffect(() => {
    if (isError) {
      checkIfError();
    }
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
    },
  };

  useEffect(() => {
    if (visible) {
      inputRef.current.focus();
      inputRef.current.select();
    } else {
      setInputString(initialValue);
    }
  }, [visible]);

  const component = (
    <>
      <input
        ref={inputRef}
        type={isPassword ? 'password' : 'text'}
        placeholder={placeholder}
        style={styles.input}
        value={inputString}
        onChange={(event) => setInputString(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleDone(inputString);
          }
        }}
      />
      <ToolItem title={'Accept'} onClick={() => handleDone(inputString)} />
      <ToolItem title={'Cancel'} onClick={() => handleCancel()} />
    </>
  );

  return component;
}
