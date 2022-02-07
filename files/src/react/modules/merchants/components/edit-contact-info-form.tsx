import * as Yup from 'yup';
import {useFormik} from 'formik';
import {
  Button,
  FieldContainer,
  ModalBody,
  ModalFooter,
  SearchableDropdown,
  TextField,
} from '@setel/portal-ui';
import * as React from 'react';
import {Merchant} from '../merchants.type';
import {useUpdateMerchantDetails} from '../merchants.queries';
import {emailRegex, statesOfMalayOptions} from '../merchant.const';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';

export const EditContactInfoForm = (props: {
  merchantId: string;
  onDone: () => void;
  onCancel: () => void;
  merchant: Merchant;
}) => {
  const {merchant} = props;
  const {
    mutate: updateMerchant,
    error: updateError,
    isLoading,
  } = useUpdateMerchantDetails(props.merchantId);
  const {values, setFieldValue, errors, handleSubmit, handleBlur, touched} =
    useFormik<ContactInfoValues>({
      initialValues: {
        authorizedSignatory: merchant.contactInfo?.authorizedSignatory || '',
        picContactNo: merchant.contactInfo?.picContactNo || '',
        personInCharge: merchant.contactInfo?.personInCharge || '',
        city: merchant.contactInfo?.city || '',
        addressLine1: merchant.contactInfo?.addressLine1 || '',
        addressLine2: merchant.contactInfo?.addressLine2 || '',
        addressLine3: merchant.contactInfo?.addressLine3 || '',
        addressLine4: merchant.contactInfo?.addressLine4 || '',
        addressLine5: merchant.contactInfo?.addressLine5 || '',
        contactCountry: merchant.contactInfo?.country || '',
        contactNo: merchant.contactInfo?.contactNo || '',
        postcode: merchant.contactInfo?.postcode || '',
        email: merchant.contactInfo?.email || '',
        state: merchant.contactInfo?.state || '',
      },
      validationSchema: contactInfoValidateSchema,
      onSubmit: (payload) => {
        updateMerchant(
          {
            status: merchant.status,
            contactInfo: {
              addressLine1: payload.addressLine1,
              addressLine2: payload.addressLine2,
              addressLine3: payload.addressLine3,
              addressLine4: payload.addressLine4,
              addressLine5: payload.addressLine5,
              city: payload.city,
              postcode: payload.postcode || (null as any),
              state: payload.state || (null as any),
              country: payload.contactCountry || (null as any),
              contactNo: payload.contactNo === '' ? (null as any) : payload.contactNo,
              email: payload.email || (null as any),
              personInCharge: payload.personInCharge,
              picContactNo: payload.picContactNo === '' ? (null as any) : payload.picContactNo,
              authorizedSignatory: payload.authorizedSignatory,
            },
          },
          {
            onSuccess: props.onDone,
          },
        );
      },
    });

  return (
    <form data-testid={'edit-contact-info-form'} onSubmit={handleSubmit}>
      <ModalBody>
        {updateError && <QueryErrorAlert error={updateError as any} />}
        <TextField
          className={updateError ? 'w-96 mt-2' : 'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Address line 1'}
          name={'addressLine1'}
          onChangeValue={(v) => setFieldValue('addressLine1', v)}
          value={values.addressLine1}
        />
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Address line 2'}
          name={'addressLine2'}
          onChangeValue={(v) => setFieldValue('addressLine2', v)}
          value={values.addressLine2}
        />
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Address line 3'}
          name={'addressLine3'}
          onChangeValue={(v) => setFieldValue('addressLine3', v)}
          value={values.addressLine3}
        />
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Address line 4'}
          name={'addressLine4'}
          onChangeValue={(v) => setFieldValue('addressLine4', v)}
          value={values.addressLine4}
        />
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Address line 5'}
          name={'addressLine5'}
          onChangeValue={(v) => setFieldValue('addressLine5', v)}
          value={values.addressLine5}
        />
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'City'}
          name={'city'}
          onChangeValue={(v) => setFieldValue('city', v)}
          value={values.city}
        />
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Postcode'}
          status={touched.postcode && errors.postcode ? 'error' : undefined}
          helpText={touched.postcode && errors.postcode ? errors.postcode : null}
          name={'postcode'}
          onChangeValue={(v) => setFieldValue('postcode', v)}
          value={values.postcode}
        />
        <FieldContainer layout={'horizontal-responsive'} label={'State'}>
          <SearchableDropdown
            wrapperClass={'w-96'}
            onBlur={handleBlur}
            disabled={isLoading}
            name={'state'}
            onChangeValue={(v) => setFieldValue('state', v)}
            value={values.state}
            options={statesOfMalayOptions}
          />
        </FieldContainer>
        <FieldContainer
          label="Country"
          layout="horizontal-responsive"
          status={touched.contactCountry && errors.contactCountry ? 'error' : undefined}
          helpText={touched.contactCountry && errors.contactCountry ? errors.contactCountry : null}>
          <SearchableDropdown
            wrapperClass={'w-96'}
            onBlur={handleBlur}
            name={'contactCountry'}
            value={values.contactCountry}
            onChangeValue={(v) => setFieldValue('contactCountry', v)}
            options={[{label: 'Malaysia', value: 'malaysia'}]}
            disabled={isLoading}
          />
        </FieldContainer>
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Contact no.'}
          status={touched.contactNo && errors.contactNo ? 'error' : undefined}
          helpText={touched.contactNo && errors.contactNo ? errors.contactNo : null}
          name={'contactNo'}
          onChangeValue={(v) => setFieldValue('contactNo', v)}
          value={values.contactNo}
        />
        <TextField
          className={'w-96'}
          status={touched.email && errors.email ? 'error' : undefined}
          helpText={touched.email && errors.email ? errors.email : null}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Email'}
          name={'email'}
          onChangeValue={(v) => setFieldValue('email', v)}
          value={values.email}
        />
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Person in charge'}
          name={'personInCharge'}
          onChangeValue={(v) => setFieldValue('personInCharge', v)}
          value={values.personInCharge}
        />
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'PIC contact no.'}
          status={touched.picContactNo && errors.picContactNo ? 'error' : undefined}
          helpText={touched.picContactNo && errors.picContactNo ? errors.picContactNo : null}
          name={'picContactNo'}
          onChangeValue={(v) => setFieldValue('picContactNo', v)}
          value={values.picContactNo}
        />
        <TextField
          className={'w-96'}
          onBlur={handleBlur}
          disabled={isLoading}
          layout={'horizontal-responsive'}
          label={'Authorized signatory'}
          name={'authorizedSignatory'}
          onChangeValue={(v) => setFieldValue('authorizedSignatory', v)}
          value={values.authorizedSignatory}
        />
      </ModalBody>
      <ModalFooter className="text-right">
        <Button onClick={props.onCancel} variant="outline" className="mr-2">
          CANCEL
        </Button>
        <Button data-testid={'submit-btn'} type="submit" variant="primary" isLoading={isLoading}>
          SAVE CHANGES
        </Button>
      </ModalFooter>
    </form>
  );
};

interface ContactInfoValues {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  addressLine5: string;
  city: string;
  postcode: string;
  state: string;
  contactCountry: string;
  contactNo: string;
  email: string;
  personInCharge: string;
  picContactNo: string;
  authorizedSignatory: string;
}

const contactInfoValidateSchema = Yup.object({
  addressLine1: Yup.string(),
  addressLine2: Yup.string(),
  addressLine3: Yup.string(),
  addressLine4: Yup.string(),
  addressLine5: Yup.string(),
  city: Yup.string(),
  postcode: Yup.string().matches(/^[0-9]+$/, 'Postcode invalid'),
  state: Yup.string(),
  contactCountry: Yup.string().when('state', {
    is: (state) => !!state,
    then: Yup.string().required('Please select country'),
    otherwise: Yup.string(),
  }),
  contactNo: Yup.string().matches(/^[0-9]+$/, 'Contact no invalid'),
  email: Yup.string().matches(emailRegex, 'Email address invalid'),
  personInCharge: Yup.string(),
  picContactNo: Yup.string().matches(/^[0-9]+$/, 'PIC contact no invalid'),
  authorizedSignatory: Yup.string(),
});
