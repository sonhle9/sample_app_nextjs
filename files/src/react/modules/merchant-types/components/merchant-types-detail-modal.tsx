import {IMerchantType} from '../merchant-types.type';
import * as React from 'react';
import {ProductLabels} from '../merchant-types.constant';
import {MERCHANT_TYPES_UPDATED_STORAGE_KEY} from '../merchant-types.service';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DropdownSelectField,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiInputField,
  TextField,
} from '@setel/portal-ui';
import {
  useDeleteMerchantType,
  useMerchantFields,
  useSetMerchantType,
} from '../merchant-types.queries';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useRouter} from '../../../routing/routing.context';
interface IMerchantTypesDetailModal {
  merchantType?: IMerchantType;
  onClose?: () => void;
}

export const MerchantTypesDetailModal = (props: IMerchantTypesDetailModal) => {
  const enterpriseId = CURRENT_ENTERPRISE.name;

  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);

  const initProducts = (isResetMode: boolean): Object => {
    if (!isResetMode && props.merchantType?.products) {
      return props.merchantType?.products;
    }
    const pro = {};
    Object.keys(ProductLabels).map((key) => (pro[key] = false));
    return pro;
  };

  const [products, setProducts] = React.useState(initProducts(false));

  const {mutate: setMerchantType, error: submitError} = useSetMerchantType(props.merchantType);
  const {mutate: deleteMerchantType} = useDeleteMerchantType(props.merchantType);
  const {data: merchantFields, error: loadMerchantFieldsError} = useMerchantFields();

  const formError = loadMerchantFieldsError || submitError;

  const router = useRouter();

  const onDeleteMerchantType = () => {
    deleteMerchantType(props.merchantType._id || props.merchantType.id, {
      onSuccess: () => {
        setVisibleDeleteConfirm(false);
        props.onClose();
        localStorage.setItem(MERCHANT_TYPES_UPDATED_STORAGE_KEY, 'Y');
        dispatchEvent(new Event('storage'));
        router.navigateByUrl('/merchant-types');
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  const title = !!props.merchantType ? 'Edit merchant type details' : 'Create merchant type';

  const {values, touched, handleSubmit, setFieldValue, errors, handleBlur} =
    useFormik<MerchantTypeValues>({
      initialValues: {
        name: props.merchantType?.name || '',
        code: props.merchantType?.code || '',
        statusValues: props.merchantType?.statusValues || [],
        statusDefaultValue: props.merchantType?.statusDefaultValue || '',
      },
      validationSchema,
      onSubmit: () => {
        setMerchantType(
          {
            ...values,
            statusValues: values.statusValues.length > 0 ? values.statusValues : null,
            statusDefaultValue: values.statusDefaultValue || null,
            enterpriseId,
            products,
            listingConfigurations: props.merchantType
              ? props.merchantType.listingConfigurations
              : merchantFields.defaultFields,
          },
          {
            onSuccess: () => {
              props.onClose();
              localStorage.setItem(MERCHANT_TYPES_UPDATED_STORAGE_KEY, 'Y');
              dispatchEvent(new Event('storage'));
            },
          },
        );
      },
    });
  const validateDefaultStatusValue = (newValues: string[]) => {
    if (newValues.length > 0 && !newValues.find((status) => status === values.statusDefaultValue)) {
      setFieldValue('statusDefaultValue', newValues[0]);
    }
    if (!newValues.length) {
      setFieldValue('statusDefaultValue', '');
    }
  };

  return (
    <>
      <Modal isOpen onDismiss={props.onClose} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {formError && <QueryErrorAlert error={formError as any} />}
            <TextField
              className={!!formError ? 'mt-2' : ''}
              label={'Name'}
              name={'name'}
              value={values.name}
              onBlur={handleBlur}
              onChangeValue={(v) => setFieldValue('name', v)}
              maxLength={128}
              disabled={!!props.merchantType}
              status={touched.name && errors.name ? 'error' : undefined}
              helpText={touched.name ? errors.name : null}
              layout={'horizontal-responsive'}
              placeholder={`Enter type name`}
            />
            <TextField
              layout={'horizontal-responsive'}
              label={'Code'}
              name={'code'}
              disabled={!!props.merchantType}
              value={values.code}
              onBlur={handleBlur}
              onChangeValue={(v) => setFieldValue('code', v)}
              maxLength={128}
              status={touched.code && errors.code ? 'error' : undefined}
              helpText={touched.code ? errors.code : null}
              placeholder={`Enter code`}
            />
            <MultiInputField
              name={'statusValues'}
              values={values.statusValues}
              onChangeValues={(v) => {
                validateDefaultStatusValue(v);
                setFieldValue('statusValues', v);
              }}
              layout={'horizontal-responsive'}
              label={'Status value options'}
              placeholder={'Enter status value options'}
            />
            <DropdownSelectField
              name={'statusDefaultValue'}
              onChangeValue={(v) => setFieldValue('statusDefaultValue', v)}
              layout={'horizontal-responsive'}
              label={'Status default value'}
              placeholder={'Select status default value'}
              options={values.statusValues.map((status) => {
                return {
                  label: status,
                  value: status,
                };
              })}
              value={values.statusDefaultValue}
            />
            <FieldContainer label={'Product'} labelAlign={'start'} layout={'horizontal-responsive'}>
              {Object.entries(ProductLabels).map((p, index) => {
                const [key, value] = p;
                return (
                  <Checkbox
                    checked={products[key]}
                    onChangeValue={(v) => setProducts({...products, [key]: v})}
                    label={value}
                    key={index}
                  />
                );
              })}
            </FieldContainer>
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-between">
              {!!props.merchantType ? (
                <span
                  style={{color: 'red', cursor: 'pointer'}}
                  onClick={() => setVisibleDeleteConfirm(true)}>
                  DELETE
                </span>
              ) : (
                <div />
              )}
              <div className="flex items-center">
                <Button variant="outline" onClick={props.onClose}>
                  CANCEL
                </Button>
                <div style={{width: 12}} />
                <Button type={'submit'} variant="primary">
                  SAVE
                </Button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
      {visibleDeleteConfirm && (
        <Dialog onDismiss={() => setVisibleDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Delete merchant type">
            Are you sure you would like to delete this merchant type? The action can not be undone?
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleDeleteConfirm(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={onDeleteMerchantType}>
              CONFIRM
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};

interface MerchantTypeValues {
  name: string;
  code: string;
  statusValues: string[];
  statusDefaultValue: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('This field is required.'),
  code: Yup.string()
    .required('This field is required.')
    .matches(/^[a-zA-Z0-9_]+$/, 'Code only contains alphanumeric and underscore'),
  statusValues: Yup.array().of(Yup.string()),
  statusDefaultValue: Yup.string(),
});
