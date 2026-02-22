import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronDown, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectTrigger = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.$isOpen ? props.theme.ui.brand.primary : props.theme.ui.border.main};
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  color: ${props => props.theme.ui.text.primary};
  font-family: ${props => props.theme.config.fonts.main};
  font-size: 1rem;
  cursor: pointer;
  transition: ${props => props.theme.config.transitions.fast};
  text-align: left;

  &:hover {
    background: ${props => props.theme.ui.action.hover};
    border-color: ${props => props.$isOpen ? props.theme.ui.brand.primary : props.theme.palette.teal.dim};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.palette.teal.dim};
  }
`;

const OptionsList = styled(motion.ul)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: ${props => props.theme.ui.background.main};
  border: 1px solid ${props => props.theme.ui.border.main};
  border-radius: 0.75rem;
  padding: 0.5rem;
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
  backdrop-filter: blur(20px);
  box-shadow: ${props => props.theme.config.shadows.card};
  list-style: none;
  margin: 0;
  transform-origin: top;
`;

const OptionItem = styled.li<{ $isSelected: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.$isSelected ? props.theme.ui.brand.primary : props.theme.ui.text.dim};
  background: ${props => props.$isSelected ? 'rgba(0, 242, 195, 0.1)' : 'transparent'};
  transition: ${props => props.theme.config.transitions.fast};
  font-size: 0.875rem;

  &:hover {
    background: ${props => props.theme.ui.action.hover};
    color: ${props => props.theme.ui.text.primary};
  }
`;

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = React.memo(({ options, value, onChange, placeholder = 'Select...' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <SelectContainer ref={containerRef}>
            <SelectTrigger $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} type="button">
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} />
                </motion.div>
            </SelectTrigger>

            <AnimatePresence>
                {isOpen && (
                    <OptionsList
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {options.map((option) => (
                            <OptionItem
                                key={option.value}
                                $isSelected={option.value === value}
                                onClick={() => handleSelect(option.value)}
                            >
                                <span>{option.label}</span>
                                {option.value === value && <Check size={14} />}
                            </OptionItem>
                        ))}
                    </OptionsList>
                )}
            </AnimatePresence>
        </SelectContainer>
    );
});
