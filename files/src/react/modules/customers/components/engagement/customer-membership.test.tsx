import {screen, within} from '@testing-library/dom';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {CustomerMembership} from './customer-membership';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`Customer's Membership`, () => {
  it('can expand member details and membership actions', async () => {
    renderWithConfig(<CustomerMembership userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    const membershipDetailsCard = await screen.findByTestId(/expand-membership-details/);

    const expandMembershipDetailsButton = await within(membershipDetailsCard).findByRole('button', {
      expanded: false,
    });
    //click on expand card button
    user.click(expandMembershipDetailsButton);

    //assert membership details' card content after expanded
    expect(await within(membershipDetailsCard).findByText(/Tier/)).toBeDefined();
    expect(await within(membershipDetailsCard).findByText(/Progress/)).toBeDefined();
    expect(await within(membershipDetailsCard).findByText(/Duration/)).toBeDefined();

    const membershipActionsCard = await screen.findByTestId(/membership-actions-card/);
    const expandMembershipActionButton = await within(membershipActionsCard).findByRole('button', {
      expanded: false,
    });
    user.click(expandMembershipActionButton);

    //asset membership actions' card content
    expect(await within(membershipActionsCard).findByText(/AMOUNT/i)).toBeDefined();
    expect(await within(membershipActionsCard).findByText(/RELATED DOCUMENT/i)).toBeDefined();
  });

  it('can open replace membership tier modal', async () => {
    renderWithConfig(<CustomerMembership userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    const editUserTierButton = await screen.findByTestId(/edit-membership-tier-button/);
    //open replace membership tier modal
    user.click(editUserTierButton);

    //assert modal details
    expect(await screen.findByText(/Replace customer's tier/)).toBeDefined();
    expect(await screen.findByText(/New tier/)).toBeDefined();
    expect(await screen.findByText(/Point progress/)).toBeDefined();
    //select dropdown menu
    const selectTierDropdown = await screen.findByTestId(/select-tier-dropdown/);
    user.click(selectTierDropdown);

    // dropdownItems are showing
    expect(await screen.findByText(/Junior/)).toBeVisible();
    expect(await screen.findByText(/Hero/)).toBeVisible();
    // user's current tier is not in the dropdown
    expect((await screen.findAllByText(/Explorer/)).length).toBe(2);

    expect(await screen.findByRole('button', {name: /SAVE CHANGES/i})).toBeDisabled();
    //click cancel
    const cancelButton = await screen.findByRole('button', {name: /CANCEL/i});
    user.click(cancelButton);
    //exit modal
    expect(cancelButton).not.toBeVisible();
  });

  it('can select junior tier and insert value for point', async () => {
    renderWithConfig(<CustomerMembership userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    const editUserTierButton = await screen.findByTestId(/edit-membership-tier-button/);
    //open replace membership tier modal
    user.click(editUserTierButton);

    //assert modal details
    expect(await screen.findByText(/Replace customer's tier/)).toBeDefined();
    expect(await screen.findByText(/Current Tier/)).toBeDefined();
    const modal = await screen.findByTestId(/replace-member-tier-modal/);
    expect(await within(modal).findByText(/Explorer/)).toBeDefined();
    //select dropdown menu
    const selectTierDropdown = await screen.findByTestId(/select-tier-dropdown/);
    user.click(selectTierDropdown);

    // dropdownItems are showing
    expect(await screen.findByText(/Junior/)).toBeVisible();
    expect(await screen.findByText(/Hero/)).toBeVisible();
    // user's current tier is not in the dropdown
    expect((await screen.findAllByText(/Explorer/)).length).toBe(2);

    const juniorInput = await screen.findByText(/Junior/);

    user.click(juniorInput);

    expect(await within(selectTierDropdown).findByText(/Junior/)).toBeDefined();

    const pointInput = (await within(modal).findByTestId(/point-textfield/)) as HTMLInputElement;
    //default value for junior
    expect(pointInput.value).toBe('99');

    const saveButton = await screen.findByRole('button', {name: /SAVE CHANGES/i});

    expect(saveButton).toBeEnabled();

    //clear existing input
    pointInput.value.split('').forEach(() => user.type(pointInput, '{backspace}'));
    expect(pointInput.value).toBe('0');

    const validJunior = '80';
    const invalidJunior = '110';
    //input invalid value for junior tier
    user.type(pointInput, invalidJunior);
    expect(pointInput.value).toBe(invalidJunior);
    expect(await screen.findByText('Value must be in range [0, 99]')).toBeVisible();
    expect(saveButton).toBeDisabled();

    //clear invalid input
    invalidJunior.split('').forEach(() => user.type(pointInput, '{backspace}'));
    expect(pointInput.value).toBe('1');
    //to remove value 1
    invalidJunior.split('').forEach(() => user.type(pointInput, '{backspace}'));
    expect(pointInput.value).toBe('0');

    //input invalid value for junior tier
    user.type(pointInput, validJunior);
    expect(pointInput.value).toBe(validJunior);
    expect(saveButton).toBeEnabled();

    //click cancel
    const cancelButton = await screen.findByRole('button', {name: /CANCEL/i});
    user.click(cancelButton);
    //exit modal
    expect(cancelButton).not.toBeVisible();
  });

  it('can select hero tier and insert value for point', async () => {
    renderWithConfig(<CustomerMembership userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    const editUserTierButton = await screen.findByTestId(/edit-membership-tier-button/);
    //open replace membership tier modal
    user.click(editUserTierButton);

    //assert modal details
    expect(await screen.findByText(/Replace customer's tier/)).toBeDefined();
    expect(await screen.findByText(/Current Tier/)).toBeDefined();
    const modal = await screen.findByTestId(/replace-member-tier-modal/);
    expect(await within(modal).findByText(/Explorer/)).toBeDefined();
    //select dropdown menu
    const selectTierDropdown = await screen.findByTestId(/select-tier-dropdown/);
    user.click(selectTierDropdown);

    // dropdownItems are showing
    expect(await screen.findByText(/Junior/)).toBeVisible();
    expect(await screen.findByText(/Hero/)).toBeVisible();
    // user's current tier is not in the dropdown
    expect((await screen.findAllByText(/Explorer/)).length).toBe(2);

    const heroInput = await screen.findByText(/Hero/);

    user.click(heroInput);

    expect(await within(selectTierDropdown).findByText(/Hero/)).toBeDefined();

    const pointInput = (await within(modal).findByTestId(/point-textfield/)) as HTMLInputElement;
    //default value for junior
    expect(pointInput.value).toBe('280');

    const saveButton = await screen.findByRole('button', {name: /SAVE CHANGES/i});

    expect(saveButton).toBeEnabled();

    //clear existing input
    pointInput.value.split('').forEach(() => user.type(pointInput, '{backspace}'));
    expect(pointInput.value).toBe('0');

    const validHero = '400';
    const invalidHero = '130';
    //input invalid value for junior tier
    user.type(pointInput, invalidHero);
    expect(pointInput.value).toBe(invalidHero);
    expect(await screen.findByText('Value must be in range [280, ∞]')).toBeVisible();
    expect(saveButton).toBeDisabled();

    //clear invalid input
    invalidHero.split('').forEach(() => user.type(pointInput, '{backspace}'));
    expect(pointInput.value).toBe('1');
    //to remove value 1
    invalidHero.split('').forEach(() => user.type(pointInput, '{backspace}'));
    expect(pointInput.value).toBe('0');

    //input invalid value for junior tier
    user.type(pointInput, validHero);
    expect(pointInput.value).toBe(validHero);
    expect(saveButton).toBeEnabled();

    //click cancel
    const cancelButton = await screen.findByRole('button', {name: /CANCEL/i});
    user.click(cancelButton);
    //exit modal
    expect(cancelButton).not.toBeVisible();
  });
});
