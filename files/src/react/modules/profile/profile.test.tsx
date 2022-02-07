import * as React from 'react';
import {screen} from '@testing-library/react';
import user from '@testing-library/user-event';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {Profile} from './profile';

describe(`<Profile />`, () => {
  it('Open Profile', async () => {
    renderWithConfig(<Profile onChangePasswordSuccess={() => {}} />);
    expect(await screen.findByText('Name')).toBeDefined();
    expect(await screen.findByText('Email')).toBeDefined();
    expect(await screen.findByText('Password')).toBeDefined();

    const changePasswordButton = await screen.findByText('Change Password');
    expect(changePasswordButton).toBeDefined();

    user.click(changePasswordButton);
    const changePasswordModal = await screen.findByTestId('change-password-modal');
    expect(changePasswordModal).toBeDefined();

    expect(await screen.findByTestId('change-password-modal_cancel-button')).toBeDefined();
    expect(await screen.findByTestId('change-password-modal_change-password-button')).toBeDefined();
  });
});
