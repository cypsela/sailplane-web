import {useWindowSize} from './useWindowSize';

export function useIsMobile() {
  const windowSize = useWindowSize();
  return windowSize.width < 600;
}
