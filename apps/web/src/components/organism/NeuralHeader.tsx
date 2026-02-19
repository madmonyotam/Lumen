import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Send } from 'lucide-react';
import { Flex, FlexCol, Relative } from '../shared/Layout';
import { useTranslation } from '../../hooks/useTranslation';

const Header = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  z-index: 10;
`;

const NeuralStatus = styled.div`
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: ${props => props.theme.colors.teal}; 
  opacity: 0.8;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const SpecimenTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: white;
  text-transform: uppercase;
  text-shadow: 0 0 10px ${props => props.theme.colors.tealDim};
`;

const StatusDotContainer = styled(Relative)`
  width: 0.75rem;
  height: 0.75rem;
`;

const StatusDotCore = styled.div<{ $color?: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props => props.$color || props.theme.colors.teal};
`;

const StatusDotPing = styled.div<{ $color?: string }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: ${props => props.$color || props.theme.colors.teal};
  opacity: 0.5;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;

  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const HeaderInputContainer = styled(Relative)`
  width: 100%;
  max-width: 32rem; 
  margin: 0 2rem;
  flex: 1;
`;

const Input = styled.input`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(${props => props.theme.glass.blur});
  border: ${props => props.theme.glass.border};
  border-radius: 9999px;
  padding: 1rem 2rem;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.main};
  font-weight: 300;
  letter-spacing: 0.05em;
  transition: all ${props => props.theme.animations.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.teal};
    box-shadow: ${props => props.theme.shadows.neonTeal};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textDim};
  }
`;

const SendButton = styled.button<{ $isRTL?: boolean }>`
  position: absolute;
  ${props => props.$isRTL ? 'left' : 'right'}: 0.75rem;
  top: 50%;
  transform: translateY(-50%) ${props => props.$isRTL ? 'rotate(-90deg)' : 'rotate(90deg)'};
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.teal};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.animations.fast};
  
  &:hover {
    background: ${props => props.theme.colors.tealDim};
    transform: translateY(-50%) ${props => props.$isRTL ? 'rotate(-90deg) scale(1.1)' : 'rotate(90deg) scale(1.1)'};
  }
`;

interface NeuralHeaderProps {
  name: string;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  rightContent?: React.ReactNode;
}

export const NeuralHeader: React.FC<NeuralHeaderProps> = ({
  name,
  inputValue,
  onInputChange,
  onSend,
  rightContent
}) => {
  const theme = useTheme();
  const { t, isRTL } = useTranslation();

  return (
    <Header>
      <FlexCol>
        <NeuralStatus>{t('neural_connection_established')}</NeuralStatus>
        <Flex $gap="1rem" $align="center">
          <StatusDotContainer>
            <StatusDotCore $color={theme.colors.teal} />
            <StatusDotPing $color={theme.colors.teal} />
          </StatusDotContainer>
          <SpecimenTitle>{name}</SpecimenTitle>
        </Flex>
      </FlexCol>

      <HeaderInputContainer>
        <Input
          type="text"
          placeholder={`${t('speak_to_placeholder')} ${name}...`}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          $isRTL={isRTL}
        />
        <SendButton onClick={onSend} $isRTL={isRTL}>
          <Send size={18} />
        </SendButton>
      </HeaderInputContainer>

      {rightContent}
    </Header >
  );
};
