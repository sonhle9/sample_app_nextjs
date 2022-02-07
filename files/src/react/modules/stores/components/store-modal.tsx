import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  DropdownSelect,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  TextInput,
  titleCase,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import _pick from 'lodash/pick';
import {TextBtn} from 'src/react/components/text-btn';
import {FulfilmentTypeEnum, IStore, StoresStatusesEnum, StoreTypeOptions} from '../stores.types';
import {useMerchant, useStation} from '../stores.queries';
import {STATION_SCHEMA} from '../stores.schema';
import {
  fulfilmentsToStringArray,
  stringArrayToFulfilments,
  stringArrayToTriggers,
  toStoreTypeOption,
  toStoreTypeValue,
  triggersToStringArray,
} from '../stores.helpers';
import {StoreTriggerEnum} from 'src/react/services/api-stores.type';
import {STORE_FULFILMENT_LABELS, STORE_STATUS_LABELS, STORE_TRIGGER_LABELS} from '../stores.const';

type IStoreEdit = Pick<
  IStore,
  | 'storeId'
  | 'name'
  | 'stationId'
  | 'stationName'
  | 'merchantId'
  | 'pdbMerchantId'
  | 'status'
  | 'fulfilments'
  | 'isMesra'
  | 'triggers'
>;

type PartialMappedKey<I extends {}, T> = {[key in keyof I]?: T};

const GENERAL_FIELDS: {
  label: string;
  key: keyof IStoreEdit;
  Component: React.VFC<{
    name: string;
    value: any;
    onChangeValue: (value: unknown) => void;
    onBlur: (event: React.FocusEvent) => void;
    disabled?: boolean;
    className?: string;
  }>;
}[] = [
  {
    label: 'Store Name',
    key: 'name',
    Component: (props) => <TextInput {...props} value={String(props.value)} />,
  },
  {
    label: 'Store Type',
    key: 'isMesra',
    Component: (props) => {
      return (
        <RadioGroup
          value={toStoreTypeOption(Boolean(props.value))}
          onChangeValue={(value) => props.onChangeValue(toStoreTypeValue(value))}
          name="isMesra">
          {Object.entries(StoreTypeOptions).map(([key, value]) => (
            <Radio key={value} value={String(value)}>
              {titleCase(key)}
            </Radio>
          ))}
        </RadioGroup>
      );
    },
  },
  {
    label: 'Station ID',
    key: 'stationId',
    Component: (props) => <TextInput {...props} value={String(props.value)} />,
  },
  {
    label: 'Station Name',
    key: 'stationName',
    Component: (props) => <TextInput {...props} value={String(props.value)} disabled />,
  },
  {
    label: 'Merchant ID',
    key: 'merchantId',
    Component: (props) => <TextInput {...props} value={String(props.value)} />,
  },
  {
    label: 'PDB Merchant ID',
    key: 'pdbMerchantId',
    Component: (props) => <TextInput {...props} value={props.value || ''} />,
  },
  {
    label: 'Fulfilment Type',
    key: 'fulfilments',
    Component: (props) => (
      <CheckboxGroup
        name="fulfilments"
        value={fulfilmentsToStringArray(props.value)}
        onChangeValue={(values) => props.onChangeValue(stringArrayToFulfilments(values))}>
        {Object.values(FulfilmentTypeEnum).map((type) => (
          <Checkbox key={type} label={STORE_FULFILMENT_LABELS[type]} value={type} />
        ))}
      </CheckboxGroup>
    ),
  },
  {
    label: 'Ordering trigger',
    key: 'triggers',
    Component: (props) => (
      <CheckboxGroup
        name="triggers"
        value={triggersToStringArray(props.value)}
        onChangeValue={(values) => props.onChangeValue(stringArrayToTriggers(values, props.value))}>
        {Object.values(StoreTriggerEnum).map((value) => (
          <Checkbox key={value} label={STORE_TRIGGER_LABELS[value]} value={value} />
        ))}
      </CheckboxGroup>
    ),
  },
  {
    label: 'Status',
    key: 'status',
    Component: (props) => (
      <DropdownSelect<any>
        {...props}
        options={Object.values(StoresStatusesEnum).map((value) => ({
          label: STORE_STATUS_LABELS[value],
          value,
        }))}
      />
    ),
  },
];

export function StoreModal({
  header,
  initialValues,
  isLoading,
  error,
  fieldProps,
  onSave,
  onDelete,
  onDismiss,
}: {
  header: string;
  initialValues: IStore;
  isLoading: boolean;
  error: string;
  fieldProps?: PartialMappedKey<IStoreEdit, {disabled?: boolean; helpText?: string}>;
  onDismiss: () => void;
  onSave: (values: IStoreEdit) => void;
  onDelete?: (values: IStoreEdit) => void;
}) {
  const formik = useFormik<IStoreEdit>({
    initialValues: _pick(
      initialValues,
      'storeId',
      'name',
      'stationId',
      'stationName',
      'merchantId',
      'pdbMerchantId',
      'status',
      'fulfilments',
      'isMesra',
      'triggers',
    ),
    onSubmit: (values: IStoreEdit) => {
      onSave(values);
    },
    validationSchema: STATION_SCHEMA,
    validateOnMount: true,
  });

  const {error: stationError, isLoading: stationLoading} = useStation(formik.values.stationId, {
    retry: false,
    onSuccess: (value) => {
      if (value) {
        formik.setFieldValue('stationName', value.name);
        if (!initialValues.location) {
          formik.setFieldValue('location', {
            latitude: value.latitude,
            longitude: value.longitude,
          });
        }
      }
    },
  });

  const {error: merchantError, isLoading: merchantLoading} = useMerchant(formik.values.merchantId, {
    retry: false,
  });

  const asyncError: PartialMappedKey<IStoreEdit, string> = {
    stationId: !!stationError && (stationError.response?.data?.message || String(stationError)),
    merchantId: !!merchantError && (merchantError.response?.data?.message || String(merchantError)),
  };
  const loadingSubmit = isLoading || stationLoading || merchantLoading;
  const disableSubmit = !formik.isValid || isLoading || !!stationError || !!merchantError;

  return (
    <Modal isOpen onDismiss={onDismiss} aria-label={header}>
      <ModalHeader>{header}</ModalHeader>
      <ModalBody data-testid="store-modal">
        {error && <Alert className="mb-4" variant="error" description={error}></Alert>}
        {GENERAL_FIELDS.map(({label, key, Component}) => {
          if (key === 'pdbMerchantId' && !formik.values.isMesra) return;
          const fieldError =
            (formik.touched[key] || formik.values[key]) && (formik.errors[key] || asyncError[key]);
          const status = fieldError ? 'error' : undefined;
          const helpText = fieldProps?.[key]?.helpText || fieldError;
          return (
            <FieldContainer
              key={key}
              label={label}
              labelAlign="start"
              layout="horizontal"
              status={status}
              helpText={helpText}>
              <Component
                name={key}
                value={formik.values[key]}
                disabled={fieldProps?.[key]?.disabled}
                onChangeValue={(value) => formik.setFieldValue(key, value)}
                onBlur={formik.handleBlur}
                className="max-w-xs"
                data-testid={`input-${key}`}
              />
            </FieldContainer>
          );
        })}
      </ModalBody>
      <ModalFooter className="flex space-x-3">
        {onDelete && (
          <TextBtn className="text-error-500" onClick={() => onDelete(formik.values)}>
            DELETE
          </TextBtn>
        )}
        <div className="flex-grow"></div>
        <Button disabled={isLoading} variant="outline" onClick={onDismiss} data-testid="btn-cancel">
          CANCEL
        </Button>
        <Button
          disabled={disableSubmit}
          isLoading={loadingSubmit}
          variant="primary"
          onClick={() => formik.handleSubmit()}
          data-testid="btn-save">
          SAVE CHANGES
        </Button>
      </ModalFooter>
    </Modal>
  );
}
