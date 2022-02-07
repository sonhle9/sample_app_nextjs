import {
  Checkbox,
  CheckboxGroup,
  DaySelector,
  DaySelectorProps,
  DecimalInput,
  DecimalInputProps,
  Radio,
  RadioGroup,
  RadioGroupProps,
  DateRangeSelector,
  DateRangeSelectorProps,
  TimeInput,
  MultiInputField,
  MultiInputFieldProps,
  DropdownMultiSelectField,
  DropdownMultiSelectFieldProps,
  DropdownSelectField,
  DropdownSelectFieldProps,
  SearchableDropdown,
  SearchableDropdownProps,
  FieldContainer,
  FieldContainerProps,
  TextareaField,
  TextareaFieldProps,
  TextField,
  TextFieldProps,
  ToggleField,
  ToggleFieldProps,
  formatDateUtc,
  PlusIcon,
  IconButton,
  TrashIcon,
  HelpText,
  Field,
  Textarea,
  TextInput,
  BareButton,
  callAll,
  MoneyInput,
  MoneyInputProps,
} from '@setel/portal-ui';
import {
  useFormikContext,
  useField,
  Field as FormikField,
  FieldArray,
  FieldArrayConfig,
  FieldArrayRenderProps,
} from 'formik';
import setDate from 'date-fns/set';
import startOfDay from 'date-fns/startOfDay';
import * as React from 'react';
import {MerchantMultiSelect, MerchantMultiSelectProps} from 'src/react/modules/merchants';

export interface FormikDropdownFieldProps extends Omit<DropdownSelectFieldProps<string>, 'value'> {
  fieldName: string;
  postWrapValue?: (string) => any;
  preWrapValue?: (any) => any;
}

export const FormikDropdownField = ({
  fieldName,
  layout = 'horizontal-responsive',
  onChangeValue = () => {},
  postWrapValue = (val) => val,
  preWrapValue = (val) => val,
  ...props
}: FormikDropdownFieldProps) => {
  const {handleBlur, setFieldValue, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <DropdownSelectField
      value={preWrapValue(value)}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      onChangeValue={callAll(
        (value) => setFieldValue(fieldName, postWrapValue(value)),
        onChangeValue,
      )}
      onBlur={handleBlur}
      layout={layout}
      {...props}
    />
  );
};

export interface FormikSearchableDropdownProps
  extends Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'>,
    Omit<SearchableDropdownProps, 'value' | 'onChangeValue'> {
  fieldName: string;
  fieldContainerClassName?: string;
}
export function FormikSearchableDropdown({
  fieldName,
  label,
  labelAlign = 'start',
  layout = 'horizontal-responsive',
  fieldContainerClassName,
  ...props
}: FormikSearchableDropdownProps) {
  const {setFieldValue, handleBlur, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <FieldContainer
      label={label}
      labelAlign={labelAlign}
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      className={fieldContainerClassName || undefined}>
      <SearchableDropdown
        name={fieldName}
        value={value ?? ''}
        onBlur={handleBlur}
        onChangeValue={(value) => setFieldValue(fieldName, value)}
        {...props}
      />
    </FieldContainer>
  );
}

export interface FormikTextFieldProps
  extends Omit<TextFieldProps, 'value' | 'onChangeValue' | 'onChange'> {
  fieldName: string;
  trim?: boolean;
}

export const FormikTextField = ({
  fieldName,
  layout = 'horizontal-responsive',
  trim = true,
  ...props
}: FormikTextFieldProps) => {
  const {handleBlur, handleChange, submitCount, setFieldValue} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <TextField
      name={fieldName}
      value={value ?? ''}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      onChange={handleChange}
      onBlur={(e) => {
        if (trim && value) setFieldValue(fieldName, value.trim());
        handleBlur(e);
      }}
      layout={layout}
      {...props}
    />
  );
};

export interface FormikTextareaFieldProps
  extends Omit<TextareaFieldProps, 'value' | 'onChangeValue' | 'onChange'> {
  fieldName: string;
  trim?: boolean;
}

export const FormikTextareaField = ({
  fieldName,
  layout = 'horizontal-responsive',
  trim = true,
  ...props
}: FormikTextareaFieldProps) => {
  const {handleBlur, handleChange, submitCount, setFieldValue} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <TextareaField
      name={fieldName}
      value={value ?? ''}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      onChange={handleChange}
      onBlur={(e) => {
        if (trim && value) setFieldValue(fieldName, value.trim());
        handleBlur(e);
      }}
      layout={layout}
      {...props}
    />
  );
};

export type FormikFieldArrayComponentProps = React.ComponentProps<'input'> & {
  index: number;
  fieldName: string;
  arrayName: string;
  trim?: boolean;
} & Partial<Pick<FieldArrayRenderProps, 'remove' | 'move'>>;

export function FormikFieldArray({
  label,
  arrayName,
  newItemValue,
  renderField,
  addButtonText = () => 'add',
  shouldShowAddButton = () => true,
  addButtonClassname = '',
  layout = 'horizontal-responsive',
  validateOnChange = false, // // can block rendering, opt-in if needed
}: {
  label: string;
  arrayName: string;
  newItemValue: any;
  renderField: (props: FormikFieldArrayComponentProps) => JSX.Element;
  addButtonText?: (items: Array<unknown>) => string;
  shouldShowAddButton?: (items: Array<unknown>) => boolean;
  addButtonClassname?: string;
  layout?: FieldContainerProps['layout'];
  validateOnChange?: FieldArrayConfig['validateOnChange'];
}) {
  const [, {value}] = useField(arrayName);
  const items: Array<unknown> = value || [];
  return (
    <FieldContainer label={label} labelAlign="start" layout={layout}>
      <FieldArray
        name={arrayName}
        validateOnChange={validateOnChange}
        render={({remove, push, move}) => (
          <section aria-label={arrayName} className="space-y-3">
            {items.map((_, index) => (
              <React.Fragment key={index}>
                {renderField({
                  index,
                  arrayName,
                  fieldName: `${arrayName}.${index}`,
                  remove,
                  move,
                })}
              </React.Fragment>
            ))}
            {shouldShowAddButton(items) && (
              <BareButton
                className={`flex items-center h-10 text-brand-500 uppercase ${addButtonClassname}`}
                onClick={() => push(newItemValue)}>
                <PlusIcon className="w-4 h-4 mr-1" />
                {addButtonText(items)}
              </BareButton>
            )}
          </section>
        )}
      />
    </FieldContainer>
  );
}

export function FormikFieldArrayTextInput({
  index,
  fieldName,
  remove,
  className,
  placeholder,
  required = false,
  trim = true,
}: FormikFieldArrayComponentProps) {
  const {handleBlur, submitCount, setFieldValue} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <Field status={touchedOrSubmitted && error ? 'error' : undefined}>
      <div className="flex items-center">
        <div className={`flex items-center ${className}`}>
          <div className="w-6">{`${index + 1}.`}</div>
          <FormikField
            as={TextInput}
            name={fieldName}
            placeholder={placeholder}
            onBlur={(e) => {
              if (trim && value) setFieldValue(fieldName, value.trim());
              handleBlur(e);
            }}
          />
        </div>
        {!required && (
          <IconButton onClick={() => remove(index)}>
            <TrashIcon className="w-5 h-5 text-red-500" />
          </IconButton>
        )}
      </div>
      {error && <HelpText className="ml-6">{error}</HelpText>}
    </Field>
  );
}

export function FormikFieldArrayTextArea({
  index,
  fieldName,
  remove,
  placeholder,
  required = false,
  trim = true,
}: FormikFieldArrayComponentProps) {
  const {handleBlur, submitCount, setFieldValue} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <Field status={touchedOrSubmitted && error ? 'error' : undefined}>
      <div className="flex">
        <div className="flex w-full">
          <div className="w-6 pt-3">{`${index + 1}.`}</div>
          <FormikField
            as={Textarea}
            name={fieldName}
            placeholder={placeholder}
            onBlur={(e) => {
              if (trim && value) setFieldValue(fieldName, value.trim());
              handleBlur(e);
            }}
          />
        </div>
        {!required && (
          <div className="pt-3">
            <IconButton onClick={() => remove(index)}>
              <TrashIcon className="w-5 h-5 text-red-500" />
            </IconButton>
          </div>
        )}
      </div>
      {error && <HelpText className="ml-6">{error}</HelpText>}
    </Field>
  );
}

export interface FormikMultiSelectFieldProps
  extends Omit<DropdownMultiSelectFieldProps<string>, 'values' | 'onChangeValues'> {
  fieldName: string;
}

export const FormikMultiSelectField = ({
  fieldName,
  layout = 'horizontal-responsive',
  labelAlign = 'start',
  ...props
}: FormikMultiSelectFieldProps) => {
  const {handleBlur, setFieldValue, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <DropdownMultiSelectField
      values={value ?? []}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      onChangeValues={(val) => setFieldValue(fieldName, val)}
      onBlur={handleBlur}
      layout={layout}
      labelAlign={labelAlign}
      {...props}
    />
  );
};

export interface FormikMultiInputFieldProps extends Omit<MultiInputFieldProps, 'values'> {
  fieldName: string;
}

export const FormikMultiInputField = ({
  fieldName,
  helpText,
  onChangeValues,
  layout = 'horizontal-responsive',
  ...props
}: FormikMultiInputFieldProps) => {
  const {setFieldValue, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <MultiInputField
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && (error ?? helpText)}
      values={value ?? []}
      onChangeValues={onChangeValues ?? ((values) => setFieldValue(fieldName, values))}
      {...props}
    />
  );
};

export interface FormikMerchantMultiSelectProps
  extends Omit<MerchantMultiSelectProps, 'values' | 'onChangeValues'>,
    Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'> {
  fieldName: string;
  wrapperClass?: string;
}

export const FormikMerchantMultiSelect = ({
  fieldName,
  label,
  labelAlign,
  layout = 'horizontal-responsive',
  wrapperClass,
  ...props
}: FormikMerchantMultiSelectProps) => {
  const {values, errors, touched, handleBlur, setFieldValue} = useFormikContext();

  const error = touched[fieldName] && errors[fieldName];

  return (
    <FieldContainer
      label={label}
      labelAlign={labelAlign}
      layout={layout}
      status={error ? 'error' : undefined}
      className={wrapperClass}
      helpText={error}>
      <MerchantMultiSelect
        values={values[fieldName]}
        onChangeValues={(val) => setFieldValue(fieldName, val)}
        onBlur={handleBlur}
        {...props}
      />
    </FieldContainer>
  );
};

interface FormikToggleFieldProps
  extends Omit<ToggleFieldProps, 'on' | 'onChangeValue' | 'onChange'>,
    Pick<FieldContainerProps, 'layout'> {
  fieldName: string;
  toggleLabel?: React.ReactNode;
  wrapperClass?: string;
}

export const FormikToggleField = ({
  fieldName,
  label,
  toggleLabel,
  layout = 'horizontal-responsive',
  disabled,
  helpText,
  wrapperClass,
}: FormikToggleFieldProps & Pick<FieldContainerProps, 'helpText'>) => {
  const {setFieldValue, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <FieldContainer
      label={label}
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && (error ?? helpText)}
      className={wrapperClass}>
      <ToggleField
        label={toggleLabel}
        on={value ?? false}
        onChangeValue={(value) => setFieldValue(fieldName, value)}
        disabled={disabled}
        wrapperClass={disabled ? 'opacity-50' : ''}
      />
    </FieldContainer>
  );
};

export interface FormikCheckboxFieldProps
  extends Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'> {
  fieldName: string;
  options: Array<{
    label: string;
    value: string;
    disabled?: boolean;
  }>;
  wrapperClass?: string;
}

export const FormikCheckboxField = ({
  fieldName,
  labelAlign = 'start',
  layout = 'horizontal-responsive',
  ...props
}: FormikCheckboxFieldProps) => {
  const {handleBlur, setFieldValue, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <FieldContainer
      label={props.label}
      labelAlign={labelAlign}
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      className={props.wrapperClass}>
      <CheckboxGroup
        name={fieldName}
        value={value ?? []}
        onChangeValue={(values) => setFieldValue(fieldName, values)}>
        {props.options.map((option) => (
          <Checkbox
            {...option}
            key={option.value}
            onBlur={handleBlur}
            wrapperClass={option.disabled ? 'opacity-50' : ''}
          />
        ))}
      </CheckboxGroup>
    </FieldContainer>
  );
};

export interface FormikDateTimeFieldProps
  extends Omit<DaySelectorProps, 'value' | 'onChangeValue'>,
    Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'> {
  fieldName: string;
  wrapperClass?: string;
}

export const FormikDateTimeField = ({
  fieldName,
  label,
  labelAlign,
  layout = 'horizontal-responsive',
  wrapperClass,
  ...props
}: FormikDateTimeFieldProps) => {
  const {handleBlur, setFieldValue, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const dateValue = React.useMemo(() => (value ? new Date(value) : undefined), [value]);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <FieldContainer
      label={label}
      labelAlign={labelAlign}
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      className={wrapperClass}>
      <div className="flex items-center space-x-2">
        <DaySelector
          value={dateValue}
          onChangeValue={(newDay) => {
            const newValue = startOfDay(newDay);
            setFieldValue(
              fieldName,
              // keep the time value is we have existing value
              formatDateUtc(dateValue ? setDate(dateValue, extractDayInfo(newValue)) : newValue),
            );
          }}
          onBlur={handleBlur}
          {...props}
        />
        <TimeInput
          hours={dateValue ? dateValue.getHours() : 0}
          minutes={dateValue ? dateValue.getMinutes() : 0}
          disabled={!dateValue}
          onChangeValue={(timeValue) => {
            if (dateValue) {
              setFieldValue(fieldName, setDate(dateValue, timeValue));
            }
          }}
        />
      </div>
    </FieldContainer>
  );
};

interface FormikDecimalInputProps
  extends Omit<DecimalInputProps, 'value' | 'onChangeValue'>,
    Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'> {
  fieldName: string;
  wrapperClass?: string;
  postFixLabel?: string;
  allowDecimalPlaces?: boolean;
}

export function FormikDecimalInput({
  fieldName,
  label,
  labelAlign,
  layout = 'horizontal-responsive',
  wrapperClass,
  postFixLabel,
  allowDecimalPlaces = false,
  ...props
}: FormikDecimalInputProps) {
  const {handleBlur, setFieldValue, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <FieldContainer
      label={label}
      labelAlign={labelAlign}
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      className={wrapperClass}>
      <section className="flex items-center">
        <DecimalInput
          name={fieldName}
          value={value?.toString() ?? ''}
          onChangeValue={(value) =>
            setFieldValue(
              fieldName,
              allowDecimalPlaces ? value : DecimalInput.getNumberValue(value),
            )
          }
          onBlur={handleBlur}
          {...props}
        />
        <div className="text-sm ml-2">{postFixLabel}</div>
      </section>
    </FieldContainer>
  );
}

interface FormikDateRangeSelectorProps
  extends Omit<DateRangeSelectorProps, 'from' | 'to' | 'value' | 'onChangeValue'>,
    Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'> {
  fieldName: string;
  value: {from: Date; to: Date};
  wrapperClass?: string;
}
export function FormikDateRangeSelector({
  fieldName,
  label,
  labelAlign,
  layout = 'horizontal-responsive',
  wrapperClass,
  value,
  ...props
}: FormikDateRangeSelectorProps) {
  const {handleBlur, setFieldValue, submitCount} = useFormikContext();
  const [, {error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <FieldContainer
      label={label}
      labelAlign={labelAlign}
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      className={wrapperClass}>
      <DateRangeSelector
        name={fieldName}
        from={value.from}
        to={value.to}
        onChangeValue={(from, to) => setFieldValue(fieldName, {from, to})}
        onBlur={handleBlur}
        {...props}
      />
    </FieldContainer>
  );
}

interface FormikDaySelectorProps
  extends Omit<DaySelectorProps, 'value' | 'onChangeValue'>,
    Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'> {
  fieldName: string;
  wrapperClass?: string;
}

export function FormikDaySelector({
  fieldName,
  label,
  labelAlign,
  layout = 'horizontal-responsive',
  wrapperClass,
  ...props
}: FormikDaySelectorProps) {
  const {handleBlur, setFieldValue, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  const dateValue = React.useMemo(() => (value ? new Date(value) : undefined), [value]);
  return (
    <FieldContainer
      label={label}
      labelAlign={labelAlign}
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      className={wrapperClass}>
      <DaySelector
        name={fieldName}
        value={dateValue}
        onChangeValue={(value) => setFieldValue(fieldName, startOfDay(value))}
        onBlur={handleBlur}
        {...props}
      />
    </FieldContainer>
  );
}

interface FormikRadioGroupProps
  extends Omit<RadioGroupProps, 'name' | 'value' | 'onChangeValue' | 'children'>,
    Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'> {
  fieldName: string;
  options: Array<{
    label: string;
    value: string;
    disabled?: boolean;
  }>;
  wrapperClass?: string;
}
export function FormikRadioGroup({
  fieldName,
  label,
  labelAlign = 'start',
  layout = 'horizontal-responsive',
  wrapperClass,
  ...props
}: FormikRadioGroupProps) {
  const {setFieldValue, submitCount, handleBlur} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <FieldContainer
      label={label}
      labelAlign={labelAlign}
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      className={wrapperClass}>
      <RadioGroup
        name={fieldName}
        value={value ?? ''}
        onChangeValue={(value) => setFieldValue(fieldName, value)}
        {...props}>
        {props.options.map((option) => (
          <Radio
            {...option}
            key={option.value}
            onBlur={handleBlur}
            wrapperClass={option.disabled ? 'opacity-50' : ''}>
            {option.label}
          </Radio>
        ))}
      </RadioGroup>
    </FieldContainer>
  );
}

interface FormikMoneyInputProps
  extends Omit<MoneyInputProps, 'value' | 'onChangeValue'>,
    Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'> {
  fieldName: string;
  wrapperClass?: string;
  allowDecimalPlaces?: boolean;
}

export function FormikMoneyInput({
  fieldName,
  label,
  labelAlign,
  layout = 'horizontal-responsive',
  allowDecimalPlaces = false,
  wrapperClass,
  ...props
}: FormikMoneyInputProps) {
  const {handleBlur, setFieldValue, submitCount} = useFormikContext();
  const [, {value, error, touched}] = useField(fieldName);
  const touchedOrSubmitted = touched || submitCount > 0;
  return (
    <FieldContainer
      label={label}
      labelAlign={labelAlign}
      layout={layout}
      status={touchedOrSubmitted && error ? 'error' : undefined}
      helpText={touchedOrSubmitted && error}
      className={wrapperClass}>
      <MoneyInput
        name={fieldName}
        value={value?.toString() ?? ''}
        onChangeValue={(value) =>
          setFieldValue(fieldName, allowDecimalPlaces ? value : MoneyInput.getNumberValue(value))
        }
        onBlur={handleBlur}
        {...props}
      />
    </FieldContainer>
  );
}

function extractDayInfo(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
  };
}
