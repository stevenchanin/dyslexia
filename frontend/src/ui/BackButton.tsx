import React from 'react';
import { Button as CButton, ButtonProps as CButtonProps } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export interface BackButtonProps extends Omit<CButtonProps, 'onClick'> {
  to?: string;
  children: React.ReactNode;
}

export function BackButton({ to, children, ...props }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <CButton
      onClick={handleClick}
      variant="ghost"
      colorScheme="green"
      size="md"
      leftIcon={<span>←</span>}
      borderRadius="full"
      px={6}
      bg="rgba(107, 153, 105, 0.15)"
      _hover={{ bg: 'rgba(107, 153, 105, 0.25)' }}
      {...props}
    >
      {children}
    </CButton>
  );
}
