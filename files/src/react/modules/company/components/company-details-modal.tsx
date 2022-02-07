import * as Yup from 'yup';
import * as React from 'react';
import {ICompany} from '../companies.type';
import {
  useSetCompany,
  useGetCompanyType,
  useDeleteCompany,
  useUpdateCompanyIdMerchant,
  companyQueryKey,
} from '../companies.queries';
import {useFormik} from 'formik';
import {
  BareButton,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DropdownSelect,
  FieldContainer,
  FileItem,
  FileSelector,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  Radio,
  TextField,
} from '@setel/portal-ui';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {ColorInput} from './color-input';
import {CompanyModalMessage, CompanyTypeCodes} from '../../../../shared/enums/company.enum';
import {useRouter} from '../../../routing/routing.context';
import {useQueryClient} from 'react-query';

interface ICompanyDetailsModalProps {
  company?: ICompany;
  onClose?: (message?, err?) => void;
  merchants?: any;
}

export const CompanyDetailsModal = (props: ICompanyDetailsModalProps) => {
  const {mutate: setCompany, error} = useSetCompany(props.company);

  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);
  const {mutate: deleteCompany} = useDeleteCompany(props.company);
  const {mutateAsync: updateCompanyIdMerchant} = useUpdateCompanyIdMerchant();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {data: companyTypes} = useGetCompanyType({
    perPage: 999,
  });

  const {values, errors, touched, handleBlur, handleSubmit, setValues, setFieldValue} = useFormik({
    initialValues: {
      logo: props.company?.logo || '',
      logoBgColor: props.company?.logoBackgroundColor || '',
      applyColorToChild: props.company?.isApplyLogoToChildMerchant || false,
      type: props.company?.companyType?.code || '',
      code: props.company?.code || '',
      name: props.company?.name || '',
      creditLimitSharing: props.company?.creditLimitSharing || false,
      creditLimit: props.company?.creditLimit?.toString() || '',
      manageCatalogue: props.company?.manageCatalogue || 'merchant_managed',
      authorisedSignatory: props.company?.authorisedSignatory || '',
      isSmartpay: props.company?.companyType?.code === CompanyTypeCodes.SMARTPAY,
    },
    validationSchema,
    onSubmit: () => {
      setCompany(
        {
          name: values.name,
          manageCatalogue: values.manageCatalogue,
          logoBackgroundColor: values.logoBgColor || null,
          isApplyLogoToChildMerchant: values.applyColorToChild,
          logoData: typeof values.logo === 'string' ? undefined : values.logo,
          ...(values.type && {
            typeId: companyTypes.find((type) => type.code === values.type).id,
          }),
          ...(values.type === CompanyTypeCodes.SMARTPAY && {
            code: values.code,
            creditLimitSharing: values.creditLimitSharing,
            creditLimit: Number.parseFloat(values.creditLimit),
          }),
          authorisedSignatory: values.authorisedSignatory,
        },
        {
          onSuccess: () => {
            props.onClose(CompanyModalMessage.SUCCESS);
          },
        },
      );
    },
  });

  const manageCatalogueOptions = [
    {
      label: 'Company managed',
      value: 'company_managed',
    },
    {
      label: 'Merchant managed',
      value: 'merchant_managed',
    },
  ];

  const companyTypeOptions = companyTypes
    ? companyTypes.map((type) => ({
        label: type.name,
        value: type.code,
      }))
    : [];
  companyTypeOptions.unshift({
    label: 'Any types',
    value: '',
  });

  const creditLimitSharingOptions = [
    {
      label: 'Yes',
      value: 'yes',
    },
    {
      label: 'No',
      value: 'no',
    },
  ];

  const renderLogoSection = () => {
    if (values.logo) {
      if (typeof values.logo === 'string') {
        return <FileItem imageSrc={values.logo} onRemove={onRemoveFile} />;
      }
      return <FileItem file={values.logo} onRemove={onRemoveFile} />;
    }
    return (
      <FileSelector
        onFilesSelected={(files) => {
          setFieldValue('logo', files[0]);
          setDisableColorChange(false);
        }}
        description="Supported format: png or svg"
        accept=".png,.svg"
        onBlur={handleBlur}
      />
    );
  };

  const [disableColorChange, setDisableColorChange] = React.useState(!props.company?.logo);
  const onRemoveFile = () => {
    setValues({
      ...values,
      logo: null,
      logoBgColor: '',
      applyColorToChild: false,
    });
    setDisableColorChange(true);
  };

  const onDeleteCompany = () => {
    deleteCompany(props.company._id || props.company.id, {
      onSuccess: () => {
        removeMerchantCompany();
        setVisibleDeleteConfirm(false);
        props.onClose(CompanyModalMessage.DELETE_SUCCESS);
        router.navigateByUrl('companies');
      },
      onError: (err) => {
        props.onClose(CompanyModalMessage.DELETE_ERROR, err);
      },
    });
  };

  const removeMerchantCompany = async () => {
    const promise = [];
    for (let i = 0; i <= props.merchants.length; i++) {
      if (props.merchants[i] && props.merchants[i].id) {
        promise.push(
          updateCompanyIdMerchant({
            merchantId: props.merchants[i].id,
            companyId: null,
          }),
        );
      }
    }
    await Promise.all(promise);
    queryClient.invalidateQueries(`${companyQueryKey.COMPANY_MERCHANTS}_${props.company?._id}`);
  };

  const title = props.company ? 'Edit details' : 'Create company';
  return (
    <form id="company-set-form" onSubmit={handleSubmit}>
      <Modal
        data-testid={'edit-company-details'}
        isOpen
        onDismiss={() => props.onClose()}
        aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {error && <QueryErrorAlert className="mb-4" error={error as any} />}
          <FieldContainer
            label="Logo"
            labelAlign={'start'}
            layout="horizontal-responsive"
            status={touched.logo && errors.logo ? 'error' : undefined}
            helpText={touched.logo && errors.logo ? errors.logo : ''}>
            {renderLogoSection()}
          </FieldContainer>

          <FieldContainer
            layout={'horizontal-responsive'}
            label={'Logo background color'}
            status={touched.logoBgColor && errors.logoBgColor ? 'error' : undefined}
            helpText={
              touched.logoBgColor && errors.logoBgColor
                ? errors.logoBgColor
                : 'Enter brand hex color code. Eg: #00A19C'
            }>
            <ColorInput
              disabled={disableColorChange}
              className={'w-64 pl-10'}
              onChangeValue={(v) => setFieldValue('logoBgColor', v)}
              value={values.logoBgColor}
              onBlur={handleBlur}
            />
          </FieldContainer>

          <FieldContainer
            layout={'horizontal-responsive'}
            label={'Apply logo to child merchants'}
            labelAlign={'start'}>
            <Radio
              disabled={disableColorChange}
              name="applyLogo"
              value="Yes"
              onChangeValue={() => setFieldValue('applyColorToChild', true)}
              onBlur={handleBlur}
              checked={values.applyColorToChild}>
              Yes
            </Radio>
            <Radio
              disabled={disableColorChange}
              name="applyLogo"
              value="No"
              onChangeValue={() => setFieldValue('applyColorToChild', false)}
              onBlur={handleBlur}
              checked={!values.applyColorToChild}>
              No
            </Radio>
          </FieldContainer>

          <FieldContainer label={'Type'} layout={'horizontal-responsive'}>
            <DropdownSelect<string>
              className={'w-64'}
              value={values.type}
              onChangeValue={(v) => {
                setFieldValue('type', v);
                if (v === CompanyTypeCodes.SMARTPAY) {
                  setFieldValue('isSmartpay', true);
                } else {
                  setFieldValue('isSmartpay', false);
                  setFieldValue('code', '');
                  setFieldValue('creditLimitSharing', false);
                  setFieldValue('creditLimit', '');
                }
              }}
              onBlur={handleBlur}
              options={companyTypeOptions}
              disabled={!!props.company && !!props.company?.companyType}
            />
          </FieldContainer>

          {values.isSmartpay && (
            <TextField
              className={'w-64'}
              label={'Code'}
              layout={'horizontal-responsive'}
              value={values.code}
              onBlur={handleBlur}
              required
              onChangeValue={(v) => setFieldValue('code', v)}
              maxLength={128}
              status={touched.code && errors.code ? 'error' : undefined}
              helpText={touched.code && errors.code ? errors.code : ''}
              placeholder={'Enter code'}
            />
          )}

          <TextField
            className={'w-64'}
            label={'Name'}
            layout={'horizontal-responsive'}
            value={values.name}
            onBlur={handleBlur}
            onChangeValue={(v) => setFieldValue('name', v)}
            maxLength={128}
            status={touched.name && errors.name ? 'error' : undefined}
            helpText={touched.name && errors.name ? errors.name : ''}
            placeholder={'Enter name'}
          />

          {props.company && values.isSmartpay && (
            <>
              <FieldContainer label={'Credit limit sharing'} layout={'horizontal-responsive'}>
                <DropdownSelect
                  className={'w-64'}
                  value={values.creditLimitSharing ? 'yes' : 'no'}
                  onChangeValue={(v) => {
                    if (v === 'yes') {
                      setFieldValue('creditLimitSharing', true);
                    } else {
                      setValues({
                        ...values,
                        creditLimitSharing: false,
                        creditLimit: '',
                      });
                    }
                  }}
                  options={creditLimitSharingOptions}
                  onBlur={handleBlur}
                />
              </FieldContainer>

              <FieldContainer
                label={'Credit limit'}
                layout={'horizontal-responsive'}
                status={touched.creditLimit && errors.creditLimit ? 'error' : undefined}
                helpText={touched.creditLimit && errors.creditLimit ? errors.creditLimit : ''}>
                <MoneyInput
                  value={values.creditLimit}
                  onBlur={handleBlur}
                  onChangeValue={(v) => setFieldValue('creditLimit', v)}
                  disabled={!values.creditLimitSharing}
                  decimalPlaces={2}
                  max={999999999.99}
                  min={0.01}
                  widthClass="w-64"
                />
              </FieldContainer>
            </>
          )}

          <FieldContainer label={'Manage catalogue'} layout={'horizontal-responsive'}>
            <DropdownSelect<string>
              className={'w-64'}
              value={values.manageCatalogue}
              onChangeValue={(v) => setFieldValue('manageCatalogue', v)}
              options={manageCatalogueOptions}
              onBlur={handleBlur}
            />
          </FieldContainer>

          {values.isSmartpay && (
            <TextField
              className={'w-64'}
              label={'Authorised signatory'}
              layout={'horizontal-responsive'}
              value={values.authorisedSignatory}
              onBlur={handleBlur}
              placeholder={'Enter authorised signatory'}
              onChangeValue={(v) => setFieldValue('authorisedSignatory', v)}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-between">
            {!!props.company ? (
              <BareButton className="text-error-500" onClick={() => setVisibleDeleteConfirm(true)}>
                DELETE THIS COMPANY
              </BareButton>
            ) : (
              <div />
            )}
            <div className="text-right space-x-3">
              <Button variant="outline" onClick={() => props.onClose()}>
                CANCEL
              </Button>
              <Button
                data-testid={'submit-btn'}
                type="submit"
                form="company-set-form"
                variant="primary">
                {!props.company ? 'SAVE' : 'SAVE CHANGES'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {visibleDeleteConfirm && (
        <Dialog onDismiss={() => setVisibleDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Confirm Deletion">
            Delete {props.company && props.company.name}? It will be removed from your companies
            list
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleDeleteConfirm(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={onDeleteCompany}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </form>
  );
};

const validationSchema = Yup.object({
  logo: Yup.mixed()
    .test('fileSize', 'File size exceeds 5MB. Please select another file.', (file) => {
      if (!file || typeof file === 'string') return true;
      return file.size <= 5 * 1024 * 1024;
    })
    .test('fileFormat', 'Only accept png and svg file format', (file) => {
      if (!file || typeof file === 'string') return true;
      return ['image/png', 'image/svg+xml'].includes(file.type);
    }),
  logoBgColor: Yup.string().matches(/^#([0-9A-F]{3}){1,2}$/i, 'Color code invalid'),
  applyColorToChild: Yup.boolean(),
  type: Yup.string(),
  isSmartpay: Yup.boolean(),
  code: Yup.string().when('isSmartpay', {
    is: true,
    then: Yup.string().required('This field is required').trim(),
  }),
  name: Yup.string().required('This field is required').trim(),
  creditLimitSharing: Yup.boolean(),
  creditLimit: Yup.number().when(['isSmartpay', 'creditLimitSharing'], {
    is: (isSmartpay, creditLimitSharing) => isSmartpay && creditLimitSharing,
    then: Yup.number()
      .required('This field is required')
      .min(0.01, 'This field must be greater than 0'),
  }),
  manageCatalogue: Yup.string(),
  authorisedSignatory: Yup.string(),
});
