import {useEffect, useState} from 'react';
import * as jdenticon from 'jdenticon';
import styled from 'styled-components';

type ContainerProps = {
  size: number;
};

const Container = styled.div<ContainerProps>`
  background-color: #fff;
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
`;

type Props = {
  address: string;
  size: number;
};

export function Jdenticon({address, size}: Props) {
  const [icon, setIcon] = useState<string | null>(null);

  useEffect(() => {
    const icon = jdenticon.toSvg(address, size);
    setIcon(icon);
  }, [address, size]);

  if (!address || !icon) return <Container size={size} />;

  return (
    <Container size={size}>
      <img
        alt={'Identicon'}
        style={{borderRadius: 8}}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
      />
    </Container>
  );
}
