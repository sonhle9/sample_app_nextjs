import {Fieldset} from '@setel/portal-ui';
import * as React from 'react';

import {convertToOptions} from '../../../ledger/fee-settings/fee-settings.const';

import {
  FormikDropdownField,
  FormikTextField,
  FormikSearchableDropdown,
} from '../../../../components/formik';

type ScoringCategoryFieldsetProps = {
  isUpdate?: boolean;
  customerTypeOptions: ReturnType<typeof convertToOptions>;
  nationalityOptions: ReturnType<typeof convertToOptions>;
  watchListOptions: ReturnType<typeof convertToOptions>;
  customerNatureOfBusinessOptions: ReturnType<typeof convertToOptions>;
};

export const ScoringCategoryFieldset = ({
  isUpdate,
  customerTypeOptions,
  nationalityOptions,
  watchListOptions,
  customerNatureOfBusinessOptions,
}: ScoringCategoryFieldsetProps) => {
  return (
    <Fieldset legend={'SCORING CATEGORY'} data-testid="scoring-category-fieldset">
      <FormikDropdownField
        disabled={isUpdate}
        fieldName="customerType"
        data-testid="risk-profile-customer-type-select"
        options={customerTypeOptions}
        placeholder="Please select"
        className="w-72"
        label="Customer's type"
        layout="horizontal-responsive"
        wrapperClass="mb-6 pl-14"
      />
      <FormikTextField
        data-testid="risk-profile-country-of-resident"
        disabled={true}
        fieldName="countryOfResident"
        maxLength={100}
        className="w-72 capitalize"
        label="Customer’s country of residence"
        layout="horizontal-responsive"
        wrapperClass="mb-6 pl-14"
      />
      <FormikSearchableDropdown
        disabled={isUpdate}
        fieldName="nationality"
        data-testid="risk-profile-customer-nationality-select"
        options={nationalityOptions}
        placeholder="Please select"
        wrapperClass="w-72"
        label="Customer's nationality"
        layout="horizontal-responsive"
        fieldContainerClassName="mb-6 pl-14"
      />
      <FormikDropdownField
        fieldName="watchList"
        data-testid="risk-profile-customer-watchlist-select"
        options={watchListOptions}
        placeholder="Please select"
        className="w-72"
        label="Watchlist"
        layout="horizontal-responsive"
        wrapperClass="mb-6 pl-14"
      />
      <FormikDropdownField
        fieldName="natureOfBusiness"
        data-testid="risk-profile-customer-nature-of-business-select"
        options={customerNatureOfBusinessOptions}
        placeholder="Please select"
        className="w-72"
        label="Customer's nature of business"
        layout="horizontal-responsive"
        wrapperClass="mb-6 pl-14"
      />
    </Fieldset>
  );
};
