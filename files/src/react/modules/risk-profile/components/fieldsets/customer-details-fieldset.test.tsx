import * as React from 'react';
import {cleanup, screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {Formik} from 'formik';

import {CustomerDetailsFieldset} from './customer-details-fieldset';

afterEach(cleanup);

describe(`<CustomerDetailsFieldset />`, () => {
  it('should render CustomerDetailsFieldset', async () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => <CustomerDetailsFieldset onTypeOfIdValueChange={() => {}} typeOfIdOptions={[]} />}
      </Formik>,
    );

    const fieldset = within(screen.getByTestId('customer-details-fieldset'));

    expect(fieldset.getByTestId('risk-profile-account-id')).toBeDefined();
    expect(fieldset.getByTestId('risk-profile-type-of-id-select')).toBeDefined();
    expect(fieldset.getByTestId('risk-profile-id-number')).toBeDefined();
  });
});
