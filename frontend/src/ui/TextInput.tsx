import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  InputProps,
  FormHelperText,
} from '@chakra-ui/react';

export function TextInput({
  label,
  helper,
  id,
  ...props
}: { label?: string; helper?: string; id?: string } & InputProps) {
  return (
    <FormControl>
      {label ? <FormLabel htmlFor={id}>{label}</FormLabel> : null}
      <Input id={id} {...props} />
      {helper ? <FormHelperText>{helper}</FormHelperText> : null}
    </FormControl>
  );
}

