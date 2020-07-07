import {useState, useEffect} from 'react';
import {useWindowSize} from './useWindowSize';

export function useIsMobile() {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 600;

  return isMobile;
}
