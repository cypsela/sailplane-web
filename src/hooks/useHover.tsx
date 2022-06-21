import {LegacyRef, useCallback, useRef, useState} from 'react';

export default function useHover() {
  const [value, setValue] = useState(false);

  const handleMouseOver = useCallback(() => setValue(true), []);
  const handleMouseOut = useCallback(() => setValue(false), []);

  const ref = useRef<HTMLDivElement>();

  const callbackRef = useCallback(
    (node: HTMLDivElement)  => {
      if (ref.current) {
        ref.current.removeEventListener('mouseenter', handleMouseOver);
        ref.current.removeEventListener('mouseleave', handleMouseOut);
      }

      ref.current = node;

      if (ref.current) {
        ref.current.addEventListener('mouseenter', handleMouseOver);
        ref.current.addEventListener('mouseleave', handleMouseOut);
      }
    },
    [handleMouseOver, handleMouseOut],
  ) as LegacyRef<HTMLDivElement>;

  return [callbackRef, value];
}
