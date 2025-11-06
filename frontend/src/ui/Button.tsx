import React from 'react';
import { Button as CButton, ButtonProps as CButtonProps } from '@chakra-ui/react';

export type ButtonProps = CButtonProps;

export function Button(props: ButtonProps) {
  return <CButton {...props} />;
}

