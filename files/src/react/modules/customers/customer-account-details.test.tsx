import {screen, waitFor, within} from '@testing-library/dom';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig, suppressConsoleLogs} from '../../lib/test-helper';
import {server} from '../../services/mocks/mock-server';
import {CustomerAccountDetails} from './customer-account-details';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {MOCK_VERIFICATIONS} from 'src/react/services/mocks/api-verifications.service.mock';

const BASE_URL = `${environment.verificationsApiBaseUrl}/api/verifications`;

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});

beforeEach(() => {
  server.use(
    rest.get(
      `${BASE_URL}/verifications/customers/d812d91d-fd8b-48d9-b889-25150c93c38f/latest`,
      (_, res, ctx) =>
        res.once(
          ctx.json(
            MOCK_VERIFICATIONS.find(
              (item) => item.customerId === 'd812d91d-fd8b-48d9-b889-25150c93c38f',
            ),
          ),
        ),
    ),
  );
});

afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});

describe(`CustomerAccountDetails`, () => {
  it('renders user profile', async () => {
    renderWithConfig(
      <CustomerAccountDetails customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />,
    );
    expect(await screen.findByText(/Phone Number/)).toBeDefined();
    expect(await screen.findByText(/Language/)).toBeDefined();
    expect(await screen.findByText(/ID Type/)).toBeDefined();
    expect(await screen.findByText(/ID Number/)).toBeDefined();
    expect(await screen.findByText(/Internal user/)).toBeDefined();
    expect(await screen.findByText(/eKYC status/)).toBeDefined();
  });

  it('should open device list on click and open unlink modal', async () => {
    renderWithConfig(
      <CustomerAccountDetails customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />,
    );

    const deviceListCard = await screen.findByTestId(/device-list-card/);

    expect(deviceListCard).toBeDefined();
    const expandButton = await within(deviceListCard).findByRole('button', {expanded: false});
    expect(expandButton).toBeDefined();
    user.click(expandButton);
    expect(await screen.findByText(/A68F556A-AF60-406C-96FD-0FDA0BFE03F0/)).toBeDefined();
    const actionButtons = await screen.findAllByTestId(/action-icon/);
    user.click(actionButtons[0]);
    const unlink = await screen.findByRole('menuitem', {name: /Unlink/});
    user.click(unlink);
    expect(
      await screen.findByText(/Are you sure you want to unlink the following device/),
    ).toBeDefined();
    const cancelButton = await screen.findByRole('button', {name: /CANCEL/});
    expect(cancelButton).toBeDefined();
    expect(await screen.findByRole('button', {name: /CONFIRM/})).toBeDefined();
    user.click(cancelButton);
    expect(cancelButton).not.toBeVisible();
  });

  it('should open blacklist device modal', async () => {
    renderWithConfig(
      <CustomerAccountDetails customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />,
    );
    const deviceListCard = await screen.findByTestId(/device-list-card/);
    const expandButton = await within(deviceListCard).findByRole('button', {expanded: false});
    user.click(expandButton);
    const actionButtons = await screen.findAllByTestId(/action-icon/);
    user.click(actionButtons[0]); //click active device
    const deactivate = await screen.findAllByRole('menuitem', {name: /Blacklist/});
    user.click(deactivate[0]); // open blacklist modal
    expect(await screen.findByText(/Are you sure you want to blacklist this device/)).toBeVisible();
    const cancelButton = await screen.findByRole('button', {name: /CANCEL/});
    expect(cancelButton).toBeDefined();
    const blacklistConfirmButton = await screen.findByRole('button', {name: /CONFIRM/});
    expect(blacklistConfirmButton).toBeDisabled();
    const remarkInput = await screen.findByPlaceholderText(/Remark/);
    user.type(remarkInput, 'user type something');
    expect(blacklistConfirmButton).toBeEnabled();
    user.click(cancelButton); // exist blacklist modal
    expect(cancelButton).not.toBeVisible();
  });

  it('should open reactivate device modal', async () => {
    renderWithConfig(
      <CustomerAccountDetails customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />,
    );
    const deviceListCard = await screen.findByTestId(/device-list-card/);
    const expandButton = await within(deviceListCard).findByRole('button', {expanded: false});
    user.click(expandButton);
    const actionButtons = await screen.findAllByTestId(/action-icon/);
    user.click(actionButtons[1]); //click blacklisted device
    const reactivate = await screen.findAllByRole('menuitem', {name: /Reactivate/});
    expect(reactivate[0]).toBeVisible();
    user.click(reactivate[0]);
    expect(
      await screen.findByText(/Are you sure you want to reactivate this device/),
    ).toBeVisible();
  });

  it('can add valid tags', async () => {
    renderWithConfig(
      <CustomerAccountDetails customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />,
    );
    const invalidText = 'InvalidText';
    const invalidLongText = 'invalidlongtextinvalidlongtextinvalidlongtext';
    const validInput1 = 'itagu';
    const validInput2 = 'i-tag-u-again';

    const actionBtn = screen.getByTestId('customer-action-dropdown');
    expect(actionBtn).toBeDefined();
    user.click(actionBtn);
    const updateTagsMenu = screen.getByTestId('customer-update-tags-menu');
    expect(updateTagsMenu).toBeDefined();
    user.click(updateTagsMenu);
    expect(await screen.findByText(/Edit tag/));
    const inputField = (await screen.findByTestId('customer-tags-multi-input')) as HTMLInputElement;

    user.type(inputField, invalidText);
    user.type(inputField, '{enter}'); // enter does not take effect due to validation
    expect(await screen.findByText('Tag must contain only a-z, 0-9, -, _')).toBeVisible();
    //clear all the input
    invalidText.split('').forEach(() => user.type(inputField, '{backspace}'));
    user.type(inputField, invalidLongText);
    expect(await screen.findByText('Tag length must be less or equal 25 characters')).toBeVisible();
    invalidLongText.split('').forEach(() => user.type(inputField, '{backspace}'));

    //Enter valid input
    user.type(inputField, validInput1);
    user.type(inputField, '{enter}');
    user.type(inputField, validInput2);
    user.type(inputField, '{enter}');
    expect(await screen.findByText(validInput1)).toBeVisible();
    expect(await screen.findByText(validInput2)).toBeVisible();
    expect(inputField.value).toBe('');
  });

  it('should show update phone form', async () => {
    renderWithConfig(
      <CustomerAccountDetails customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />,
    );
    const actionBtn = screen.getByTestId('customer-action-dropdown');
    expect(actionBtn).toBeDefined();
    user.click(actionBtn);
    const updatePhoneMenu = screen.getByTestId('customer-update-phone-menu');
    expect(updatePhoneMenu).toBeDefined();
    user.click(updatePhoneMenu);

    //open modal
    expect(await screen.findByText('Change phone number')).toBeDefined();
    const cancelButton = await screen.findByRole('button', {name: /CANCEL/});

    //exit modal
    user.click(cancelButton);
    expect(cancelButton).not.toBeVisible();
  });

  it('should show correct smartpay balance', async () => {
    renderWithConfig(
      <CustomerAccountDetails customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />,
    );
    const smartpayBalance = await screen.findByTestId(/smartpay-balance/);
    const smartpayDefaultBalance = 'RM0.00';

    expect(smartpayBalance.innerHTML).not.toBe(smartpayDefaultBalance);
  });

  it('should show eKYC status', async () => {
    renderWithConfig(
      <CustomerAccountDetails customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />,
    );
    const eKYCStatus = await screen.findByTestId(/ekyc-details-status/);

    waitFor(() => expect(eKYCStatus.innerHTML).toBe('APPROVED'));
  });

  it('should show error for eKYC status', async () => {
    suppressConsoleLogs(async () => {
      renderWithConfig(
        <CustomerAccountDetails customerID={'d812d91d-fd8b-48d9-b889-25150c93c38d'} />,
      );

      server.use(
        rest.get(
          `${BASE_URL}/verifications/customers/d812d91d-fd8b-48d9-b889-25150c93c38d/latest`,
          (_, res, ctx) =>
            res.once(
              ctx.status(403),
              ctx.json({
                customerId: 'd812d91d-fd8b-48d9-b889-25150c93c38d',
                verificationStatus: 'ERROR',
              }),
            ),
        ),
      );

      const eKYCStatus = await screen.findByTestId(/ekyc-details-status/);

      waitFor(() => expect(eKYCStatus.innerHTML).toBe('ERROR'));
    });
  });
});
