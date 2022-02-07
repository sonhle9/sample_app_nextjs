import * as React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {AxiosError} from 'axios';

import {RiskScoringConfig} from 'src/react/services/api-risk-profiles.service';
import {useNotification} from 'src/react/hooks/use-notification';

import {RiskProfileUpdateModal} from './modals/risk-profile-update-modal';
import {RiskProfileCreateModal} from './modals/risk-profile-create-modal';

import {CreatingReason, IdentifierType, RiskScoringConfigType} from '../risk-profile.enum';
import {
  useCreateRiskProfile,
  useGetListRiskScorings,
  useRiskProfileDetails,
  useUpdateRiskProfile,
} from '../risk-profile.queries';

import {convertToOptions} from '../../ledger/fee-settings/fee-settings.const';
import {countryOptions} from '../../risk-profile/risk-profile.const';

type RiskProfileModalProps = {
  onClose(): void;
  isUpdate?: boolean;
  riskProfileId?: string;
};

const riskProfileCreateSchema = Yup.object({
  accountId: Yup.string().required('Account ID is required').max(40),
  typeOfId: Yup.string().required('ID type is required').max(40),
  idNumber: Yup.string().required('ID number is required').max(20),
  customerType: Yup.string().required(`Customer's type is required`).max(40),
  countryOfResident: Yup.string().max(40),
  nationality: Yup.string().max(40),
  watchList: Yup.string().required(`Watchlist is required`).max(40),
  natureOfBusiness: Yup.string().required(`Customer's nature of business is required`).max(40),
  checkFor: Yup.string().required(`Check for is required`).max(40),
  remarks: Yup.string().max(200),
});

const riskProfileUpdateSchema = Yup.object({
  watchList: Yup.string().required(`Watchlist is required`).max(40),
  natureOfBusiness: Yup.string().required(`Customer's nature of business is required`).max(40),
  checkFor: Yup.string().required(`Check for is required`).max(40),
  remarks: Yup.string().max(200),
});

const TYPE_OF_ID_OPTIONS = convertToOptions(IdentifierType, {
  hideOptionAll: true,
}).map((item) => ({
  ...item,
  label: item.label.split(' ').join(''),
}));
const CHECK_FOR_OPTIONS = convertToOptions(CreatingReason, {hideOptionAll: true});

const mapRiskScoringToOptions = (
  riskScorings: RiskScoringConfig[],
  type: RiskScoringConfigType,
) => {
  if (!riskScorings) {
    return [];
  }
  return riskScorings
    .filter((item) => item.type === type)
    .map((item) =>
      item.riskScorings.map((option) => ({label: option.description, value: option.value})),
    )
    .flat();
};

const getSelectionOptions = (
  riskScorings: RiskScoringConfig[],
): {label: string; value: string}[][] => {
  const customerTypeOptions = mapRiskScoringToOptions(
    riskScorings,
    RiskScoringConfigType.CustomerType,
  );
  const watchListOptions = mapRiskScoringToOptions(riskScorings, RiskScoringConfigType.watchList);
  const customerNatureOfBusinessOptions = mapRiskScoringToOptions(
    riskScorings,
    RiskScoringConfigType.CustomernatureOfBusiness,
  );

  return [customerTypeOptions, watchListOptions, customerNatureOfBusinessOptions];
};

export const RiskProfileModal = ({onClose, isUpdate, riskProfileId}: RiskProfileModalProps) => {
  const [serverError, setServerError] = React.useState('');

  const showMsg = useNotification();
  const {data: riskScorings, isLoading: isGettingRiskScorings} = useGetListRiskScorings();
  const [customerTypeOptions, watchListOptions, customerNatureOfBusinessOptions] =
    getSelectionOptions(riskScorings);

  const {mutate: create, isLoading: isCreating} = useCreateRiskProfile();
  const {mutate: update, isLoading: isUpdating} = useUpdateRiskProfile(riskProfileId);

  const submitForm = (riskProfileValues: any) => {
    if (isUpdate) {
      update(riskProfileValues, {
        onSuccess: () => {
          showMsg({
            title: 'Successfully',
            variant: 'success',
            description: 'Risk profile is successfully updated',
          });
          onClose();
        },
        onError: (err: AxiosError) => {
          if (err.response.data.errorCode === '1107000') {
            setServerError('Unable to update risk profile.');
          } else {
            setServerError(err.response.data.message);
          }
        },
      });
    } else {
      create(riskProfileValues, {
        onSuccess: () => {
          showMsg({
            title: 'Successfully',
            variant: 'success',
            description: 'Risk profile is successfully created',
          });
          onClose();
        },
        onError: (err: AxiosError) => {
          if (err.response.data.errorCode === '1107000') {
            setServerError('Unable to create risk profile.');
          } else {
            setServerError(err.response.data.message);
          }
        },
      });
    }
  };

  const {data: riskProfileDetails, isLoading: isGettingDetails} = riskProfileId
    ? useRiskProfileDetails(riskProfileId)
    : {data: undefined, isLoading: false};

  return (
    <Formik
      initialValues={{
        accountId: undefined,
        typeOfId: undefined,
        idNumber: undefined,
        customerType: undefined,
        countryOfResident: undefined,
        nationality: 'MYS',
        watchList: undefined,
        natureOfBusiness: undefined,
        checkFor: undefined,
        remarks: undefined,
      }}
      onSubmit={submitForm}
      validationSchema={isUpdate ? riskProfileUpdateSchema : riskProfileCreateSchema}
      validateOnChange={false}
      validateOnMount={false}>
      {(formikProps) =>
        isUpdate ? (
          <RiskProfileUpdateModal
            riskProfileData={riskProfileDetails}
            isLoading={isGettingDetails || isGettingRiskScorings}
            onClose={onClose}
            serverError={serverError}
            customerTypeOptions={customerTypeOptions}
            nationalityOptions={countryOptions}
            watchListOptions={watchListOptions}
            customerNatureOfBusinessOptions={customerNatureOfBusinessOptions}
            checkForOptions={CHECK_FOR_OPTIONS}
            isUpdating={isUpdating}
            handleSubmit={formikProps.handleSubmit}
          />
        ) : (
          <RiskProfileCreateModal
            onClose={onClose}
            serverError={serverError}
            typeOfIdOptions={TYPE_OF_ID_OPTIONS}
            customerTypeOptions={customerTypeOptions}
            nationalityOptions={countryOptions}
            watchListOptions={watchListOptions}
            customerNatureOfBusinessOptions={customerNatureOfBusinessOptions}
            checkForOptions={CHECK_FOR_OPTIONS}
            isCreating={isCreating}
            handleSubmit={formikProps.handleSubmit}
          />
        )
      }
    </Formik>
  );
};
