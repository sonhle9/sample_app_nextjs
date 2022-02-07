import {Button, ButtonProps, callAll, useTransientState, CheckIcon} from '@setel/portal-ui';
import * as React from 'react';
import {copyText} from 'src/react/lib/copy';

export interface CopyButtonProps extends ButtonProps {
  textToCopy: string;
  successMessage?: string;
  successLeftIcon?: React.ReactNode;
}

export const CopyButton = ({
  textToCopy,
  successMessage = 'COPIED',
  successLeftIcon = <CheckIcon />,
  leftIcon,
  children,
  ...props
}: CopyButtonProps) => {
  const [copied, setCopied] = useTransientState(false);

  return (
    <Button
      {...props}
      onClick={callAll(props.onClick, () => {
        copyText(textToCopy).then(() => setCopied(true));
      })}
      leftIcon={copied ? successLeftIcon : leftIcon}>
      {copied ? successMessage : children}
    </Button>
  );
};
