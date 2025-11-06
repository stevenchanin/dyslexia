import React from 'react';
import { Alert as CAlert, AlertIcon, AlertTitle, AlertDescription, AlertProps as CAlertProps } from '@chakra-ui/react';

export type AlertProps = CAlertProps & { title?: string; description?: string };

export function Alert({ title, description, children, ...props }: React.PropsWithChildren<AlertProps>) {
  return (
    <CAlert {...props}>
      <AlertIcon />
      <div>
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {description ? <AlertDescription>{description}</AlertDescription> : children}
      </div>
    </CAlert>
  );
}

