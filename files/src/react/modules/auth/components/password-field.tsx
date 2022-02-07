import React from 'react';
import {
  CheckInCircleIcon,
  CheckInCircleOutlineIcon,
  EyeHideIcon,
  EyeShowIcon,
  Field,
  FieldStatus,
  HelpText,
  Label,
  TextInput,
} from '@setel/portal-ui';
import {TextInputProps} from '@setel/portal-ui/dist/components/form-control/text-input';
import classNames from 'classnames';
const passwordRules = [
  {name: 'Minimum 14 characters', validate: (password) => password && password.length >= 14},
  {
    name: 'Uppercase characters (A-Z)',
    validate: (password) => password && password.match(/^(?=.*[A-Z])/g),
  },
  {
    name: 'Lowercase characters (a-z)',
    validate: (password) => password && password.match(/^(?=.*[a-z])/g),
  },
  {name: 'Numbers (0-9)', validate: (password) => password && password.match(/^(?=.*\d)/g)},
  {
    name: 'At least one special characters (#, $, !, etc.)',
    validate: (password) => password && password.match(/[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g),
  },
];

interface PasswordField {
  value: string;
  showPassword: boolean;
  status: FieldStatus;
  onToggleShowPassword: () => void;
  label?: string;
  errormessage?: string;
  wrapperInputClassName?: string;
}
type PasswordFieldProps = PasswordField & TextInputProps;
export const PasswordField = ({
  value,
  showPassword,
  onToggleShowPassword,
  status,
  style,
  wrapperInputClassName,
  ...inputProps
}: PasswordFieldProps) => (
  <Field status={status}>
    {inputProps.label && (
      <Label className="block leading-5 text-mediumgrey text-sm font-light">
        {inputProps.label}
      </Label>
    )}
    <div className={classNames('relative', wrapperInputClassName)}>
      <TextInput autoComplete="off" type={showPassword ? 'text' : 'password'} {...inputProps} />
      <button
        type="button"
        onClick={onToggleShowPassword}
        className="absolute inset-y-0 right-0 w-10 rounded-full bg-transparent flex items-center justify-center focus:outline-none focus:shadow-outline-gray">
        {showPassword ? (
          <EyeShowIcon className="w-4 h-4 text-lightgrey" />
        ) : (
          <EyeHideIcon className="w-4 h-4 text-lightgrey" />
        )}
      </button>
    </div>
    {status === 'error' && <HelpText>{inputProps.errormessage || ''}</HelpText>}
  </Field>
);
export const validatePassword = (value): boolean => {
  return passwordRules.filter((rule) => !rule.validate(value)).length === 0;
};

interface PasswordValidationProps {
  title: string;
  titleClassName: string;
  rulesClassName: string;
  value: string;
}
export const PasswordValidation = ({
  title,
  titleClassName,
  rulesClassName,
  value,
}: PasswordValidationProps) => {
  return (
    <div className={`leading-7 text-xs text-mediumgrey font-normal mt-2.5`}>
      <span className={titleClassName}>{title}</span>
      <br />
      {passwordRules.map((rule, idx) => (
        <div key={`password_rule_${idx}`}>
          {' '}
          {rule.validate(value) ? (
            <CheckInCircleIcon className="w-4 h-4 float-left text-brand-500 mt-1.5 mr-1" />
          ) : (
            <CheckInCircleOutlineIcon className="w-4 h-4 float-left mt-1.5 mr-1" />
          )}
          <span className={rulesClassName}>{rule.name}</span>
        </div>
      ))}
    </div>
  );
};
