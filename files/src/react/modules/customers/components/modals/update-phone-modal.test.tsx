import * as React from 'react';
import {cleanup, screen, within} from '@testing-library/react';
import {Formik} from 'formik';
import {renderWithConfig} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';

import {UpdatePhoneModal} from './update-phone-modal';
import {IUserProfile} from '../../../../services/api-accounts.service';

afterEach(cleanup);

describe(`<UpdatePhoneModal />`, () => {
  it('should render UpdatePhoneModal', async () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <UpdatePhoneModal
            customerId="customerId"
            data={
              {
                phone: '0987654321',
              } as IUserProfile
            }
            onDismiss={() => {}}
          />
        )}
      </Formik>,
    );

    const modal = within(screen.getByTestId('customer-update-phone-modal'));

    const currentPhoneDisplay = modal.getByTestId(
      'customer-current-phone-number',
    ) as HTMLInputElement;
    const newPhoneInput = modal.getByTestId('customer-new-phone-num-input') as HTMLInputElement;
    const submitBtn = modal.getByTestId('submit-btn') as HTMLButtonElement;

    expect(currentPhoneDisplay).toBeDefined();
    expect(currentPhoneDisplay.disabled).toBeTruthy();
    expect(newPhoneInput).toBeDefined();

    user.type(newPhoneInput, '60000000000');

    user.click(submitBtn);

    expect(await screen.findByText('Are you sure want to change this phone number?')).toBeDefined();
  });

  it.each([
    {
      case: 'phone is empty',
      expected: 'This field is required.',
    },
    {
      case: 'phone is invalid',
      input: 'abc',
      expected: 'Should be valid phone number.',
    },
    {
      case: 'phone is not beginning with 60',
      input: '0000',
      expected: 'Must start with 60.',
    },
    {
      case: 'phone is less than 11 chars',
      input: '60000',
      expected: 'Must be longer than or equal to 11 characters.',
    },
    {
      case: 'phone is longer than 12 chars',
      input: '60000000000000',
      expected: 'Must be less than or equal to 12 characters.',
    },
  ])('should show error if $case', async ({input, expected}) => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <UpdatePhoneModal
            customerId="customerId"
            data={
              {
                phone: '0987654321',
              } as IUserProfile
            }
            onDismiss={() => {}}
          />
        )}
      </Formik>,
    );

    const modal = within(screen.getByTestId('customer-update-phone-modal'));

    const currentPhoneDisplay = modal.getByTestId(
      'customer-current-phone-number',
    ) as HTMLInputElement;
    const newPhoneInput = modal.getByTestId('customer-new-phone-num-input') as HTMLInputElement;
    const submitBtn = modal.getByTestId('submit-btn') as HTMLButtonElement;

    expect(currentPhoneDisplay).toBeDefined();
    expect(currentPhoneDisplay.disabled).toBeTruthy();
    expect(newPhoneInput).toBeDefined();

    input && user.type(newPhoneInput, input);

    user.click(submitBtn);

    expect(await screen.findByText(expected)).toBeDefined();
  });
});
