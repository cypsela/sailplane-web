import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {setStatus} from '../actions/tempData';

export function useElementCopy ({message}) {
  const dispatch = useDispatch();
  const elementToCopy = useRef(null);

  const doCopy = () => {
    const range = document.createRange();
    range.selectNode(elementToCopy.current);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    setTimeout(() => {
      window.getSelection().removeRange(range);
    }, 100);

    dispatch(
      setStatus({
        message,
        isInfo: true,
      }),
    );
    setTimeout(() => {
      dispatch(setStatus({}));
    }, 2000);
  };

  return [elementToCopy, doCopy];
}
