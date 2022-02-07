import {Fieldset} from '@setel/portal-ui';
import * as React from 'react';

import {convertToOptions} from '../../../ledger/fee-settings/fee-settings.const';

import {FormikDropdownField, FormikTextField} from '../../../../components/formik';

type CustomerDetailsFieldsetProps = {
  typeOfIdOptions: ReturnType<typeof convertToOptions>;
  onTypeOfIdValueChange: (value) => void;
};

export const CustomerDetailsFieldset = ({
  typeOfIdOptions,
  onTypeOfIdValueChange,
}: CustomerDetailsFieldsetProps) => {
  return (
    <Fieldset
      legend={'CUSTOMER DETAILS'}
      className={'sm:col-span-2'}
      data-testid="customer-details-fieldset">
      <FormikTextField
        fieldName="accountId"
        style={{paddingLeft: 14}}
        id="accountIdInput"
        maxLength={40}
        placeholder="Search account ID"
        className="w-72"
        data-testid="risk-profile-account-id"
        label="Account ID"
        layout="horizontal-responsive"
        wrapperClass={'pl-14'}
      />
      <FormikDropdownField
        fieldName="typeOfId"
        data-testid="risk-profile-type-of-id-select"
        onChangeValue={(value) => onTypeOfIdValueChange(value)}
        options={typeOfIdOptions}
        placeholder="Please select"
        className="w-72"
        label="Type of ID"
        layout="horizontal-responsive"
        wrapperClass="mb-6 pl-14"
      />
      <FormikTextField
        data-testid="risk-profile-id-number"
        id="idNumberInput"
        fieldName="idNumber"
        maxLength={20}
        placeholder="Enter ID number"
        className="w-72"
        label="ID number"
        layout="horizontal-responsive"
        wrapperClass="mb-6 pl-14"
      />
    </Fieldset>
  );
};
