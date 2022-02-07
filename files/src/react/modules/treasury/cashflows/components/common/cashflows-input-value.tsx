import {FieldContainer, MoneyInput, TextInput} from '@setel/portal-ui';
import React from 'react';

interface ICashflowsEdit {
  balanceLabel: string;
  value?: string;
  errorMessage?: string;
}

interface ICashflowsInputValueProps extends ICashflowsEdit {
  onChangeValueMoney: (newValue: string) => void;
  onChangeValueReason: (reason: string) => void;
}

export function CashflowsInputValue(props: ICashflowsInputValueProps) {
  return (
    <>
      <FieldContainer
        label={props.balanceLabel}
        status={props.errorMessage ? 'error' : null}
        helpText={props.errorMessage}
        layout="horizontal">
        <MoneyInput
          className="text-right pl-11"
          value={props.value}
          onChangeValue={(value) => props.onChangeValueMoney(value)}
          allowNegative={true}
          data-testid="input-money"
        />
      </FieldContainer>
      <FieldContainer className="mt-5" label="Reason" layout="horizontal">
        <TextInput className="h-11" onChangeValue={props.onChangeValueReason} />
      </FieldContainer>
    </>
  );
}
