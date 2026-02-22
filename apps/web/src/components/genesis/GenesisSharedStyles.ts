import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Flex, FlexCol } from '../shared/Layout';

export const MotionFlexCol = motion(FlexCol);

export const LifespanExpectancy = styled.p`
    text-align: center;
    font-size: 0.75rem;
    color: ${props => props.theme.ui.brand.primary};
`;

export const Overlay = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: radial-gradient(circle at center, #0a0a0c 0%, #000 100%);
    color: white;
    font-family: ${props => props.theme.config.fonts.main};
`;

export const Content = styled(motion.div)`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 700px;
    height: 750px;
    max-height: 90vh;
    padding: 1.5rem;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 2rem;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.5);
`;

export const Title = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-align: center;
    background: linear-gradient(to right, ${props => props.theme.palette.teal.main}, ${props => props.theme.palette.blue.main});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
    text-align: center;
    color: ${props => props.theme.ui.text.dim};
    font-size: 0.875rem;
    letter-spacing: 0.1em;
`;

export const FormGroup = styled(FlexCol)`
    gap: 1.5rem;
    margin-bottom: 1rem;
`;

export const Label = styled.label`
    font-size: 0.625rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${props => props.theme.ui.text.dim};
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

export const Input = styled.input`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1rem 1.5rem;
    color: white;
    font-size: 1rem;
    width: 100%;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.palette.teal.main};
        background: rgba(255, 255, 255, 0.08);
    }
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
    }
`;

export const LifespanSlider = styled.input`
    width: 100%;
    accent-color: ${props => props.theme.palette.teal.main};
    margin-top: 1rem;
`;

export const LifespanLabels = styled(Flex)`
    justify-content: space-between;
    font-size: 0.625rem;
    color: ${props => props.theme.ui.text.dim};
    margin-top: 0.5rem;
`;

export const SubmitButton = styled(motion.button)`
    background: linear-gradient(to right, ${props => props.theme.palette.teal.main}, ${props => props.theme.palette.blue.main});
    border: none;
    border-radius: 9999px;
    padding: 1.25rem;
    color: ${props => props.theme.palette.black};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 1rem;
    box-shadow: 0 10px 30px rgba(0, 242, 254, 0.3);
`;

export const NavButton = styled(motion.button)`
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    padding: 1rem 2rem;
    color: white;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${props => props.theme.palette.teal.main};
        color: ${props => props.theme.palette.teal.main};
    }
`;

export const StepDot = styled.div<{ $active: boolean }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$active ? props.theme.palette.teal.main : 'rgba(255, 255, 255, 0.1)'};
    transition: all 0.3s ease;
`;

export const StepWrapper = styled.div`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    padding-right: 0.5rem;
    position: relative;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.02);
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
