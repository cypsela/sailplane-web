import React, {useEffect, useRef, useState} from 'react';
import {ToolItem} from '../components/ToolItem';
import {primary, primary3} from '../colors';

export default function useTextInput(visible, handleDone, handleCancel, initialValue, {placeholder, actionTitle}) {
  const [inputString, setInputString] = useState(initialValue);
  const inputRef = useRef(null);

  const styles = {
    input: {
      border: `1px solid ${primary3}`,
      borderRadius: 4,
      color: primary,
      fontSize: 14,
      fontWeight: 200,
      padding: 4,
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
        type={'text'}
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
      <ToolItem title={actionTitle} onClick={() => handleDone(inputString)} />
      <ToolItem
        title={'Cancel'}
        onClick={() => {
          handleCancel();
        }}
      />
    </>
  );

  return component;
}
