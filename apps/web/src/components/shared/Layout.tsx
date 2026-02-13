import styled from 'styled-components';

export const Flex = styled.div<{ $gap?: string; $align?: string; $justify?: string; $wrap?: string; $direction?: string }>`
  display: flex;
  gap: ${props => props.$gap || '0'};
  align-items: ${props => props.$align || 'stretch'};
  justify-content: ${props => props.$justify || 'flex-start'};
  flex-wrap: ${props => props.$wrap || 'nowrap'};
  flex-direction: ${props => props.$direction || 'row'};
`;

export const FlexCol = styled(Flex)`
  flex-direction: column;
`;

export const Center = styled(Flex)`
  align-items: center;
  justify-content: center;
`;

export const FullSize = styled.div`
  width: 100%;
  height: 100%;
`;

export const Relative = styled.div`
  position: relative;
`;

export const AbsoluteFill = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;
