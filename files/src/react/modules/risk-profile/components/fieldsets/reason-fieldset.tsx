import {Fieldset} from '@setel/portal-ui';
import * as React from 'react';

import {convertToOptions} from '../../../ledger/fee-settings/fee-settings.const';

import {FormikDropdownField, FormikTextareaField} from '../../../../components/formik';

type ReasonFieldsetProps = {
  checkForOptions: ReturnType<typeof convertToOptions>;
};

export const ReasonFieldset = ({checkForOptions}: ReasonFieldsetProps) => {
  return (
    <Fieldset legend={'REASON'} data-testid="reason-fieldset">
      <FormikDropdownField
        fieldName="checkFor"
        data-testid="check-for-select"
        options={checkForOptions}
        placeholder="Please select"
        className="w-72"
        label="Check for"
        layout="horizontal-responsive"
        wrapperClass="mb-6 pl-14"
      />
      <FormikTextareaField
        data-testid="risk-profile-remarks"
        fieldName="remarks"
        id="remarksInput"
        maxLength={200}
        placeholder="Enter remarks"
        label="Remarks"
        layout="horizontal-responsive"
        wrapperClass="mb-6 pl-14"
      />
    </Fieldset>
  );
};
