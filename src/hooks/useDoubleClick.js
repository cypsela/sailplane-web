import React from 'react';

export default function useDoubleClick(callback) {
  const [elem, setElem] = React.useState(null);
  const countRef = React.useRef(0);
  const timerRef = React.useRef(null);
  const inputCallbackRef = React.useRef(null);
  const callbackRef = React.useCallback((node) => {
    setElem(node);
    callbackRef.current = node;
  }, []);

  React.useEffect(() => {
    inputCallbackRef.current = callback;
  });

  React.useEffect(() => {
    function handler() {
      const isDoubleClick = countRef.current + 1 === 2;
      const timerIsPresent = timerRef.current;
      if (timerIsPresent && isDoubleClick) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        countRef.current = 0;
        if (inputCallbackRef.current) {
          inputCallbackRef.current();
        }
      }
      if (!timerIsPresent) {
        countRef.current = countRef.current + 1;
        timerRef.current = setTimeout(() => {
          clearTimeout(timerRef.current);
          timerRef.current = null;
          countRef.current = 0;
        }, 200);
      }
    }

    if (elem) {
      elem.addEventListener('click', handler);
    }

    return () => {
      if (elem) {
        elem.removeEventListener('click', handler);
      }
    };
  }, [elem]);
  return [callbackRef, elem];
}
