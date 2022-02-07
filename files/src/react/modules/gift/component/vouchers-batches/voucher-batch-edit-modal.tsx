import {
  Alert,
  Button,
  Checkbox,
  DateTimeInput,
  DecimalInput,
  DropdownSelectField,
  FieldContainer,
  FileItem,
  FileSelector,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  PlusIcon,
  Textarea,
  TextInput,
} from '@setel/portal-ui';
import {FieldArray, FormikProvider, useFormik} from 'formik';
import moment from 'moment';
import React, {useState} from 'react';
import {parseCodesFile} from '../../../../../app/vouchers/parseCodesFile';
import {ModeType} from '../../../voucher-report/shared/voucher.constants';
import {
  addRuleSchema,
  addVoucherSchema,
  DisplayAs,
  editVoucherSchema,
  VoucherBatchGenerationType,
  VoucherBatchSection,
  VoucherRedeemType,
} from '../../shared/gift-voucher.constant';
import {useAddVoucher} from '../../voucher-batch.query';
import {VoucherBatchTypeForm} from './voucher-batch-type-form';

interface IVoucherBatchEditModal {
  modeType: ModeType;
  section: VoucherBatchSection;
  onClose: () => void;
  onSave?: any;
  voucherBatch?: any;
}

export const VoucherBatchEditModal = (props: IVoucherBatchEditModal) => {
  const {voucherBatch} = props;
  const [errorMsg, setErrorMsg] = useState('');
  const [onLinkingExpiry, setOnLinkingExpiry] = useState(false);
  const {mutate: addVoucher} = useAddVoucher();

  const formik = useFormik({
    initialValues: voucherBatch ?? {
      name: voucherBatch?.name || '',
      file: undefined,
      redeemType: voucherBatch?.redeemType || '',
      expiryDate: voucherBatch?.expiryDate || undefined,
      startDate: voucherBatch?.startDate || undefined,
      duration: voucherBatch?.duration || 0,
      generationType: voucherBatch?.generationType || '',
      vouchersCount: voucherBatch?.vouchersCount || '',
    },
    validationSchema:
      props.modeType === ModeType.Add
        ? addVoucherSchema
        : props.modeType === ModeType.Edit
        ? editVoucherSchema
        : addRuleSchema,
    onSubmit: (values) => {
      if (props.modeType === ModeType.Add) {
        return addVoucher(values, {
          onSuccess: () => {
            props.onClose();
          },
          onError: (err: any) => {
            const response = err.response && err.response.data;
            setErrorMsg(response.message);
          },
        });
      }
      props.onSave(values);
      props.onClose();
    },
  });

  const {values, errors, setFieldValue, touched, handleBlur, handleSubmit} = formik;

  const onChangeRule = (
    fieldName: string,
    value: string | string[] | Date | number,
    index: number,
  ) => {
    const rules = [...values.rules];
    rules[index][fieldName] = value;
    if (fieldName === 'daysToExpire') {
      rules[index]['expiryDate'] = undefined;
    }
    setFieldValue('rules', rules);
  };

  // set start date of voucher batch
  const setStartDate = (value) => {
    if (!onLinkingExpiry) {
      const expiredDate = moment(value).add(values.duration, 'd');
      setFieldValue('expiryDate', expiredDate);
    }
    setFieldValue('startDate', value);
  };

  // set expiry date of voucher batch switch between expiry date and duration
  const setExpiryDate = (value: string | Date) => {
    if (onLinkingExpiry && value instanceof Date) {
      const duration = moment(value).diff(voucherBatch?.startDate, 'days');
      setFieldValue('expiryDate', value);
      setFieldValue('duration', duration);
      return;
    }
    const expiredDate = moment(values.startDate).add(value as string, 'd');
    setFieldValue('expiryDate', expiredDate);
    setFieldValue('duration', value);
  };

  const setFileValue = (file: File, codes: []) => {
    setFieldValue('file', file);
    setFieldValue('codes', codes);
  };

  const setFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      try {
        setFieldValue('file', file);
        setFieldValue('codes', parseCodesFile(reader.result));
      } catch (errors) {
        setFileValue(undefined, []);
      }
    };
    reader.onerror = () => {
      reader.abort();
      setFileValue(undefined, []);
    };
  };

  return (
    <Modal
      isOpen
      onDismiss={props.onClose}
      aria-label="Voucher batch form"
      data-testid="add-custom-field-modal">
      <ModalHeader>
        {props.modeType === ModeType.Add
          ? 'Create voucher batches'
          : props.modeType === ModeType.Edit && props.section === VoucherBatchSection.general
          ? 'General'
          : props.modeType === ModeType.Edit && props.section === VoucherBatchSection.details
          ? 'Voucher details'
          : 'Batch rules'}
      </ModalHeader>
      <ModalBody>
        {errorMsg && <Alert className="mb-3" variant="error" description={errorMsg} />}
        {props.section == VoucherBatchSection.general && (
          <>
            <FieldContainer
              label="Voucher name"
              status={touched.name && errors.name ? 'error' : null}
              helpText={touched.name && errors.name}
              layout="horizontal-responsive">
              <TextInput
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChangeValue={(value) => setFieldValue('name', value)}
                className="w-1/2"
                maxLength={40}
                placeholder="Name"
              />
            </FieldContainer>
            <>
              <DropdownSelectField
                label="Redeem type"
                layout="horizontal-responsive"
                data-testid="redeem-type"
                status={touched.redeemType && errors.redeemType ? 'error' : null}
                helpText={touched.redeemType && errors.redeemType}
                value={values.redeemType}
                onChangeValue={(value) => {
                  setFieldValue('redeemType', value);
                }}
                options={Object.entries(VoucherRedeemType).map(([key, label]) => ({
                  label,
                  value: key,
                }))}
                onBlur={handleBlur}
                className="w-1/2"
                placeholder="Select type"
              />
            </>
            <>
              <DropdownSelectField
                label="Generation type"
                data-testid="generation-type"
                layout="horizontal-responsive"
                status={touched.generationType && errors.generationType ? 'error' : null}
                helpText={touched.generationType && errors.generationType}
                value={values.generationType}
                onChangeValue={(value) => {
                  if (VoucherBatchGenerationType[value] != VoucherBatchGenerationType.instant) {
                    setFieldValue('vouchersCount', '');
                  }
                  setFieldValue('generationType', value);
                  setOnLinkingExpiry(false);
                }}
                options={Object.entries(VoucherBatchGenerationType).map(([key, label]) => ({
                  label,
                  value: key,
                }))}
                onBlur={handleBlur}
                className="w-1/2"
                placeholder="Select type"
              />
              {VoucherBatchGenerationType[values.generationType] ==
                VoucherBatchGenerationType.instant && (
                <FieldContainer
                  label="Voucher quantity"
                  layout="horizontal-responsive"
                  status={touched.vouchersCount && errors?.vouchersCount ? 'error' : null}
                  helpText={touched.vouchersCount && errors?.vouchersCount}>
                  <DecimalInput
                    value={values.vouchersCount.toString()}
                    onChangeValue={(value) => setFieldValue('vouchersCount', parseInt(value))}
                    decimalPlaces={0}
                    max={50000}
                    className="w-14"
                  />
                </FieldContainer>
              )}
              {VoucherBatchGenerationType[values.generationType] ==
                VoucherBatchGenerationType.upload && (
                <FieldContainer
                  label="Upload CSV"
                  layout="horizontal"
                  labelAlign="start"
                  status={values.file && values.file.length >= 1 ? 'success' : 'error'}>
                  <FileSelector
                    onFilesSelected={(files) => setFile(files[0])}
                    description="CSV up to 10MB"
                    fileType="csv"
                    file={values.file}
                  />
                  {values.file && (
                    <div className="space-y-2 py-2">
                      <FileItem file={values.file} onRemove={() => setFileValue(undefined, [])} />
                    </div>
                  )}
                </FieldContainer>
              )}
            </>
            <FieldContainer
              label="Start date"
              layout="horizontal-responsive"
              status={touched.generationType && errors?.startDate ? 'error' : null}
              helpText={touched.generationType && errors?.startDate}>
              <DateTimeInput
                value={values.startDate ? new Date(values.startDate) : null}
                onChangeValue={(value) => setStartDate(value)}
                placeholder="Select date"
                // onPopoverClose={() => setTouched(true)}
              />
            </FieldContainer>
            {VoucherBatchGenerationType[values.generationType] !=
              VoucherBatchGenerationType.upload &&
              VoucherBatchGenerationType[values.generationType] !=
                VoucherBatchGenerationType['on-demand'] && (
                <>
                  <FieldContainer label="" layout="horizontal-responsive" labelAlign="start">
                    <Checkbox
                      checked={onLinkingExpiry}
                      label="Link expiry date"
                      onChangeValue={setOnLinkingExpiry}
                    />
                  </FieldContainer>
                </>
              )}

            {VoucherBatchGenerationType[values.generationType] ==
              VoucherBatchGenerationType.instant &&
              onLinkingExpiry && (
                <FieldContainer
                  label="Expiry date"
                  layout="horizontal-responsive"
                  status={touched.generationType && errors?.expiryDate ? 'error' : null}
                  helpText={touched.generationType && errors?.expiryDate}>
                  <DateTimeInput
                    value={values.expiryDate ? new Date(values.expiryDate) : null}
                    onChangeValue={(value) => setExpiryDate(value)}
                    placeholder="Select date"
                  />
                </FieldContainer>
              )}
            {!onLinkingExpiry && (
              <FieldContainer label="Duration" layout="horizontal-responsive">
                <DecimalInput
                  value={values.duration.toString()}
                  onChangeValue={(value) => setExpiryDate(value)}
                  className="inline-block w-14 text-left mr-2"
                />
                <Label className="inline-block text-black" children="days" />
              </FieldContainer>
            )}
          </>
        )}

        {props.section == VoucherBatchSection.details && (
          <>
            <FieldContainer
              label="Voucher code prefix"
              status={touched.prefix && errors.prefix ? 'error' : null}
              helpText={touched.prefix && errors.prefix}
              layout="horizontal-responsive">
              <TextInput
                value={values.prefix}
                onChangeValue={(value) => setFieldValue('prefix', value)}
                className="w-1/2"
              />
            </FieldContainer>
            <FieldContainer
              label="Voucher code postfix"
              status={touched.postfix && errors.postfix ? 'error' : null}
              helpText={touched.postfix && errors.postfix}
              layout="horizontal-responsive">
              <TextInput
                value={values.postfix}
                onChangeValue={(value) => setFieldValue('postfix', value)}
                className="w-1/2"
              />
            </FieldContainer>
            <FieldContainer
              label="Banner image URL"
              layout="horizontal-responsive"
              status={errors?.bannerUrl ? 'error' : null}
              helpText={errors?.bannerUrl}>
              <TextInput
                type="url"
                value={values.bannerUrl}
                onChangeValue={(value) => setFieldValue('bannerUrl', value)}
                className="w-1/2"
              />
            </FieldContainer>
            <FieldContainer
              label="Icon image URL"
              layout="horizontal-responsive"
              status={errors?.iconUrl ? 'error' : null}
              helpText={errors?.iconUrl}>
              <TextInput
                type="url"
                value={values.iconUrl}
                onChangeValue={(value) => setFieldValue('iconUrl', value)}
                className="w-1/2"
              />
            </FieldContainer>
            <FieldContainer label="Description" layout="horizontal-responsive">
              <Textarea
                value={values.description}
                onChangeValue={(value) => setFieldValue('description', value)}
                className="w-1/2"
              />
            </FieldContainer>
            <FieldContainer
              label="Terms & condition URL"
              layout="horizontal-responsive"
              status={errors?.termsUrl ? 'error' : null}
              helpText={errors?.termsUrl}>
              <TextInput
                value={values.termsUrl}
                type="url"
                onChangeValue={(value) => setFieldValue('termsUrl', value)}
                className="w-1/2"
              />
            </FieldContainer>
            <FieldContainer label="Terms & condition Content" layout="horizontal-responsive">
              <Textarea
                value={values.termContent}
                onChangeValue={(value) => setFieldValue('termContent', value)}
                className="w-1/2"
              />
            </FieldContainer>
            <DropdownSelectField
              label="Display as"
              layout="horizontal-responsive"
              value={values.displayAs}
              onChangeValue={(value) => setFieldValue('displayAs', value)}
              options={Object.entries(DisplayAs).map(([key, label]) => ({
                label,
                value: key,
              }))}
              className="w-1/2"
              placeholder="Select Display As"
            />
          </>
        )}

        {props.section == VoucherBatchSection.rules && (
          <>
            <>
              <FormikProvider value={formik}>
                <FieldArray
                  name="rules"
                  render={() => {
                    return (
                      <>
                        {values.rules.map((rule, index) => {
                          return (
                            <VoucherBatchTypeForm
                              key={index}
                              rule={rule}
                              index={index}
                              touched={touched.rules && touched.rules[index]}
                              errors={errors.rules && errors.rules[index]}
                              onChangeRule={onChangeRule}
                              removeRule={(index) =>
                                setFieldValue(
                                  'rules',
                                  values.rules.filter((_v, ind) => index !== ind),
                                )
                              }
                            />
                          );
                        })}
                      </>
                    );
                  }}
                />
              </FormikProvider>
            </>

            <FieldContainer>
              <p
                className="flex items-center text text-brand-500 cursor-pointer"
                onClick={() =>
                  setFieldValue('rules', [
                    ...values.rules,
                    {
                      name: '',
                      amount: '',
                      expiryDate: null,
                      daysToExpire: null,
                      tag: '',
                      type: '',
                    },
                  ])
                }>
                <PlusIcon className="inline-block mr-1 w-4 h-4" />{' '}
                <span className="tracking-1 font-semibold text-xs">ADD RULE</span>
              </p>
            </FieldContainer>
          </>
        )}
      </ModalBody>
      <Modal.Footer>
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={props.onClose}>
            CANCEL
          </Button>
          <div style={{width: 12}} />
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
            data-testid="submit-adjust-collection">
            SAVE
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
