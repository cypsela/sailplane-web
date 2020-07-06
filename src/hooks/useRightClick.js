import React, {useEffect, useState, useRef, useCallback} from 'react';

export default function useRightClick(callback) {
  const [elem, setElem] = useState(null);
  const inputCallbackRef = useRef(null);
  const callbackRef = useCallback((node) => {
    setElem(node);
    callbackRef.current = node;
  }, []);

  useEffect(() => {
    inputCallbackRef.current = callback;
  });

  useEffect(() => {
    if (!elem) return;
    elem.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      inputCallbackRef.current(event);
    });
  }, [elem]);
  return [callbackRef, elem];
}
