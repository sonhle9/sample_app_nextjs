import {TextInputProps} from '@setel/portal-ui/dist/components/form-control/text-input';
import {TextInput} from '@setel/portal-ui';
import React from 'react';

export const ColorInput = ({value, ...rest}: TextInputProps) => {
  return (
    <div className={'relative'}>
      <div className={'w-10 rounded absolute top-0 bottom-0 left-0 inline-flex p-3'}>
        <div className={'w-full'} style={{backgroundColor: value as any}} />
      </div>

      <TextInput value={value} {...rest} />
    </div>
  );
};
