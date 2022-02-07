import React, {useState} from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeading,
  Checkbox,
  DaySelector,
  DecimalInput,
  DropdownSelectField,
  FieldContainer,
  Label,
  TextInput,
} from '@setel/portal-ui';

interface IVoucherBatchTypeFormProps {
  index: number;
  rule: any;
  touched?: any;
  errors: any;
  onChangeRule: (
    fieldName: string,
    value: string | string[] | Date | number,
    index: number,
  ) => void;
  removeRule: (index: number) => void;
}

export const VoucherBatchTypeForm = (props: IVoucherBatchTypeFormProps) => {
  const [isDuration, setIsDuration] = useState(Boolean(props.rule.daysToExpire));
  return (
    <Card className="mb-10" defaultIsOpen>
      <CardHeading title={`Rule ${props.index + 1}`} className="border-none">
        <Button
          className="border-none shadow-none"
          variant="error-outline"
          minWidth="none"
          children="REMOVE"
          onClick={() => {
            props.removeRule(props.index);
          }}
        />
      </CardHeading>
      <CardContent>
        <FieldContainer
          label="Rule name"
          status={props.touched?.name && props.errors?.name ? 'error' : null}
          helpText={props.touched?.name && props.errors?.name}
          layout="horizontal-responsive">
          <TextInput
            value={props.rule.name}
            onChangeValue={(val) => props.onChangeRule('name', val, props.index)}
            className="w-32 error"
            placeholder="Name"
          />
        </FieldContainer>
        <FieldContainer
          label="Amount (RM)"
          status={props.touched?.amount && props.errors?.amount ? 'error' : null}
          helpText={props.touched?.amount && props.errors?.amount}
          layout="horizontal-responsive">
          <DecimalInput
            value={props.rule.amount.toString()}
            onChangeValue={(value) => {
              props.onChangeRule(
                'amount',
                value ? DecimalInput.getNumberValue(value) : undefined,
                props.index,
              );
            }}
            decimalPlaces={0}
            placeholder="0"
            max={50000}
            className="w-16 text-left"
          />
        </FieldContainer>
        <FieldContainer
          label="Expiry date"
          layout="horizontal-responsive"
          status={props.touched?.expiryDate && props.errors?.expiryDate ? 'error' : null}
          helpText={props.touched?.expiryDate && props.errors?.expiryDate}>
          <DaySelector
            value={props.rule.expiryDate ? new Date(props.rule.expiryDate) : null}
            onChangeValue={(value) => {
              props.onChangeRule('expiryDate', value, props.index);
            }}
            disabled={isDuration}
          />
        </FieldContainer>
        <FieldContainer label="" layout="horizontal-responsive" labelAlign="start">
          <Checkbox
            checked={isDuration}
            label="Days duration"
            onChangeValue={(checked) => {
              setIsDuration(checked);
              props.onChangeRule('daysToExpire', null, props.index);
            }}
          />
        </FieldContainer>
        {isDuration && (
          <FieldContainer label="Duration" layout="horizontal-responsive">
            <DecimalInput
              value={props.rule.daysToExpire ? props.rule.daysToExpire.toString() : ''}
              onChangeValue={(value) => {
                props.onChangeRule('daysToExpire', parseInt(value), props.index);
              }}
              decimalPlaces={0}
              placeholder="0"
              max={50000}
              className="inline-block w-14 text-left mr-2"
            />
            <Label className="inline-block text-black" children="days" />
          </FieldContainer>
        )}
        <DropdownSelectField
          label="Rule type"
          data-testid="generation-type"
          layout="horizontal-responsive"
          status={props.touched?.type && props.errors?.type ? 'error' : null}
          helpText={props.touched?.type && props.errors?.type}
          value={props.rule.type}
          onChangeValue={(value) => {
            props.onChangeRule('type', value, props.index);
          }}
          options={Object.entries(RuleTypes).map(([key, label]) => ({
            label,
            value: key,
          }))}
          className="w-1/2"
          placeholder="Select type"
        />
        <FieldContainer
          label="Tag"
          status={props.touched?.tag && props.errors?.tag ? 'error' : null}
          helpText={props.touched?.tag && props.errors?.tag}
          layout="horizontal-responsive">
          <TextInput
            value={props.rule.tag}
            onChangeValue={(val) => props.onChangeRule('tag', val, props.index)}
            className="w-1/2 error"
            placeholder="Tag"
          />
        </FieldContainer>
      </CardContent>
    </Card>
  );
};

enum RuleTypes {
  'topup-regular' = 'Topup Regular',
  'topup-bonus' = 'Topup Bonus',
}
