import {Alert, Button, dedupeArray, Modal, titleCase, useDebounce} from '@setel/portal-ui';
import {Formik} from 'formik';
import * as React from 'react';
import {
  FormikDropdownField,
  FormikMultiSelectField,
  FormikTextField,
} from 'src/react/components/formik';
import {useNotification} from 'src/react/hooks/use-notification';
import {selectError} from 'src/react/lib/ajax';
import {useMerchantSearch, useMultipleMerchantDetails} from 'src/react/modules/merchants';
import {
  Acquirer,
  AcquirerCreateInput,
  AcquirersPaymentProcessor,
  AcquirersStatus,
  AcquirersType,
} from 'src/react/services/api-switch.service';
import * as Yup from 'yup';
import {paymentProcessorOptions} from '../acquirer.const';
import {useCreateAcquirerMutation, useUpdateAcquirerMutation} from '../acquirer.queries';

export interface AcquirerFormProps {
  current?: Acquirer;
  onDismiss: () => void;
}

export const AcquirerForm = (props: AcquirerFormProps) => {
  const showMsg = useNotification();

  const {mutate: create, isLoading: isCreating, error: createError} = useCreateAcquirerMutation();
  const {mutate: update, isLoading: isUpdating, error: updateError} = useUpdateAcquirerMutation();
  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  const errorMessage = error && selectError(error as any, 'Fail to save');

  const currentMerchantDetails = useMultipleMerchantDetails(
    props.current ? props.current.merchantIds : [],
    {
      enabled: props.current && props.current.merchantIds.length > 0,
      select: (result) =>
        result.map((merchant) => ({
          value: merchant.merchantId,
          label: merchant.name,
        })),
    },
  );

  const [merchantSearch, setMerchantSearch] = React.useState('');
  const merchantSearchValue = useDebounce(merchantSearch);

  const merchantSearchQuery = useMerchantSearch(
    {
      name: merchantSearchValue,
    },
    {
      select: (result) =>
        result.items.map((merchant) => ({
          value: merchant.merchantId,
          label: merchant.name,
        })),
    },
  );

  const merchantOptions = React.useMemo(() => {
    if (!currentMerchantDetails.data) {
      return merchantSearchQuery.data;
    }
    if (!merchantSearchQuery.data) {
      return currentMerchantDetails.data;
    }

    return dedupeArray(currentMerchantDetails.data.concat(merchantSearchQuery.data), 'value');
  }, [currentMerchantDetails.data, merchantSearchQuery.data]);

  const defaultValues = React.useMemo(
    () =>
      props.current
        ? {
            ...props.current,
            ipay88MerchantCode: props.current.credentials.ipay88?.merchantCode,
            ipay88MerchantKey: props.current.credentials.ipay88?.merchantKey,
            ipay88AesKey: props.current.credentials.ipay88?.aesKey,
            boostMerchantId: props.current.credentials.boost?.merchantId,
            boostApiKey: props.current.credentials.boost?.apiKey,
            boostApiSecretKey: props.current.credentials.boost?.apiSecretKey,
          }
        : initialValues,
    [props.current],
  );

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      validateOnMount={false}
      validateOnChange={false}
      onSubmit={(values) => {
        if (props.current) {
          update(
            {...mapValuesToApiData(values), id: props.current.id},
            {
              onSuccess: () => {
                showMsg({
                  title: 'Acquirer updated.',
                });
                props.onDismiss();
              },
            },
          );
        } else {
          create(mapValuesToApiData(values), {
            onSuccess: () => {
              showMsg({
                title: 'Acquirer created.',
              });
              props.onDismiss();
            },
          });
        }
      }}>
      {(formikBag) => (
        <form onSubmit={formikBag.handleSubmit}>
          <Modal.Body className="space-y-5">
            {errorMessage && <Alert variant="error" description={errorMessage} />}
            <FormikTextField label="Name" fieldName="combinedName" layout="horizontal-responsive" />
            <FormikDropdownField
              label="Type"
              fieldName="type"
              options={typeOptions}
              layout="horizontal-responsive"
              data-testid="acquirer-type"
            />
            {formikBag.values.type === AcquirersType.MERCHANT && (
              <FormikMultiSelectField
                fieldName="merchantIds"
                label="Merchants"
                onInputValueChange={setMerchantSearch}
                options={merchantSearch === merchantSearchValue ? merchantOptions : undefined}
                layout="horizontal-responsive"
                data-testid="acquirer-merchants"
              />
            )}
            <FormikDropdownField
              label="Payment processor"
              fieldName="paymentProcessor"
              options={paymentProcessorOptions}
              layout="horizontal-responsive"
              data-testid="acquirer-processor"
            />
            {formikBag.values.paymentProcessor === AcquirersPaymentProcessor.IPAY88 && (
              <>
                <FormikTextField
                  label="iPay88 Merchant Code"
                  fieldName="ipay88MerchantCode"
                  layout="horizontal-responsive"
                />
                <FormikTextField
                  label="iPay88 Merchant Key"
                  fieldName="ipay88MerchantKey"
                  layout="horizontal-responsive"
                />
                <FormikTextField
                  label="iPay88 AES Key"
                  fieldName="ipay88AesKey"
                  layout="horizontal-responsive"
                />
              </>
            )}
            {formikBag.values.paymentProcessor === AcquirersPaymentProcessor.BOOST && (
              <>
                <FormikTextField
                  label="Boost Merchant ID"
                  fieldName="boostMerchantId"
                  layout="horizontal-responsive"
                />
                <FormikTextField
                  label="Boost API Key"
                  fieldName="boostApiKey"
                  layout="horizontal-responsive"
                />
                <FormikTextField
                  label="Boost API Secret"
                  fieldName="boostApiSecretKey"
                  layout="horizontal-responsive"
                />
              </>
            )}
            <FormikDropdownField
              label="Status"
              fieldName="status"
              options={statusOptions}
              layout="horizontal-responsive"
              data-testid="acquirer-status"
            />
          </Modal.Body>
          <Modal.Footer className="text-right space-x-3">
            <Button onClick={props.onDismiss} variant="outline">
              CANCEL
            </Button>
            <Button isLoading={isLoading} variant="primary" type="submit">
              SAVE
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Formik>
  );
};

const initialValues: AcquirerFormValues = {
  combinedName: '',
  type: '',
  paymentProcessor: '',
  status: '',
  merchantIds: [],
  ipay88MerchantCode: '',
  ipay88MerchantKey: '',
  ipay88AesKey: '',
  boostMerchantId: '',
  boostApiKey: '',
  boostApiSecretKey: '',
};
interface AcquirerFormValues {
  combinedName: string;
  type: string;
  paymentProcessor: string;
  status: string;
  merchantIds: string[];
  ipay88MerchantCode: string;
  ipay88MerchantKey: string;
  ipay88AesKey: string;
  boostMerchantId: string;
  boostApiKey: string;
  boostApiSecretKey: string;
}

const ipayFieldSchema = Yup.string().when('paymentProcessor', {
  is: AcquirersPaymentProcessor.IPAY88,
  then: Yup.string().required('Required'),
});

const boostFieldSchema = Yup.string().when('paymentProcessor', {
  is: AcquirersPaymentProcessor.BOOST,
  then: Yup.string().required('Required'),
});

const validationSchema = Yup.object({
  combinedName: Yup.string().required('Name is required'),
  type: Yup.string().required(),
  paymentProcessor: Yup.string().required(),
  status: Yup.string().required(),
  merchantIds: Yup.array().when('type', {
    is: AcquirersType.MERCHANT,
    then: Yup.array().required('Add at least one merchant'),
  }),
  ipay88MerchantCode: ipayFieldSchema,
  ipay88MerchantKey: ipayFieldSchema,
  ipay88AesKey: ipayFieldSchema,
  boostMerchantId: boostFieldSchema,
  boostApiKey: boostFieldSchema,
  boostApiSecretKey: boostFieldSchema,
});

const mapValuesToApiData = (values: AcquirerFormValues): AcquirerCreateInput => ({
  combinedName: values.combinedName,
  type: values.type as AcquirersType,
  paymentProcessor: values.paymentProcessor as AcquirersPaymentProcessor,
  status: values.status as AcquirersStatus,
  name: values.combinedName,
  credentials:
    values.paymentProcessor === AcquirersPaymentProcessor.IPAY88
      ? {
          ipay88: {
            merchantCode: values.ipay88MerchantCode,
            merchantKey: values.ipay88MerchantKey,
            aesKey: values.ipay88AesKey,
          },
        }
      : values.paymentProcessor === AcquirersPaymentProcessor.BOOST
      ? {
          boost: {
            apiKey: values.boostApiKey,
            apiSecretKey: values.boostApiSecretKey,
            merchantId: values.boostMerchantId,
          },
        }
      : {},
  merchantIds: values.type === AcquirersType.MERCHANT ? values.merchantIds : [],
});

const typeOptions = Object.values(AcquirersType).map((value) => ({
  value,
  label: titleCase(value),
}));

const statusOptions = Object.values(AcquirersStatus).map((value) => ({
  value,
  label: titleCase(value),
}));
