import {useWindowSize} from './useWindowSize';

export function useIsSmallScreen() {
  const windowSize = useWindowSize();
  return windowSize.width < 600;
}
