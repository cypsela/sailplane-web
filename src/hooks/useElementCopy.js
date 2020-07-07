import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {setStatus} from '../actions/tempData';
import {delay} from '../utils/Utils'

export function useElementCopy ({message}) {
  const dispatch = useDispatch();
  const elementToCopy = useRef(null);

  const doCopy = () => {
    const range = document.createRange();
    range.selectNode(elementToCopy.current);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    document.execCommand('copy');
    dispatch(setStatus({message, isInfo: true}));

    delay(100).then(() => window.getSelection().removeRange(range));
    delay(2000).then(() => dispatch(setStatus({})));
  };

  return [elementToCopy, doCopy];
}
