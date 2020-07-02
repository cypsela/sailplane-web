import React, {useEffect, useRef, useState} from 'react';
import {ToolItem} from '../components/ToolItem';
import {primary, primary3} from '../colors';

export default function useTextInput(visible, handleDone, handleCancel, initialValue) {
  const [inputString, setInputString] = useState(initialValue);
  const inputRef = useRef(null);

  const styles = {
    editInput: {
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
    } else {
      setInputString(initialValue);
    }
  }, [visible]);

  const component = (
    <>
      <input
        ref={inputRef}
        type={'text'}
        placeholder={'new folder'}
        style={styles.editInput}
        value={inputString}
        onChange={(event) => setInputString(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleDone(inputString);
          }
        }}
      />
      <ToolItem title={'Create'} onClick={() => handleDone(inputString)} />
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
