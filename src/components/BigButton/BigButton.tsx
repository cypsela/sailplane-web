import React, {CSSProperties, RefObject} from 'react';
import styled, {useTheme} from 'styled-components';
import useHover from '../../hooks/useHover';

type ContainerProps = {
  fullWidth?: boolean;
  backgroundColor?: string;
  fillColor: string;
  color: string;
};

const Container = styled.div<ContainerProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({fullWidth}) => (fullWidth ? '100%' : undefined)};
  background-color: ${({backgroundColor}) => backgroundColor};
  color: ${({color}) => color};
  border-radius: 4px;
  padding: 6px 8px;
  border: 1px solid ${({fillColor}) => fillColor};
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
`;

type Props = {
  title: string;
  onClick: () => void;
  inverted?: boolean;
  fullWidth?: boolean;
  customFillColor?: string;
  customWhiteColor?: string;
  style?: CSSProperties;
  noHover?: boolean;
  id?: string;
};

export function BigButton({
  title,
  onClick,
  inverted,
  fullWidth,
  customFillColor,
  customWhiteColor,
  style,
  noHover,
  id,
}: Props) {
  const [hoverRef, isHovered] = useHover();
  const theme = useTheme();

  const fillColor = customFillColor || theme.primary45;
  const whiteColor = customWhiteColor || '#FFF';

  let initialBg = undefined;
  let hoverBg: string | undefined = fillColor;

  let initialColor = fillColor;
  let hoverColor = whiteColor;

  if (inverted) {
    initialBg = fillColor;
    hoverBg = undefined;
    initialColor = whiteColor;
    hoverColor = fillColor;
  }

  const backgroundColor = isHovered && !noHover ? hoverBg : initialBg;
  const color = isHovered && !noHover ? hoverColor : initialColor;

  return (
    <Container
      id={id}
      backgroundColor={backgroundColor}
      fullWidth={fullWidth}
      fillColor={fillColor}
      color={color}
      style={style}
      onClick={onClick}>
      {title}
    </Container>
  );
}
