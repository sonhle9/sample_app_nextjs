import {screen, within} from '@testing-library/dom';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {CustomerRewards} from './customer-rewards';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`Reward section`, () => {
  it('can view member info in rewards section', async () => {
    renderWithConfig(<CustomerRewards userId="d812d91d-fd8b-48d9-b889-25150c93c38f" />);
    const memberInfoCard = await screen.findByTestId(/member-info-card/);
    const memberInfoExpandButton = await within(memberInfoCard).findByRole('button', {
      expanded: false,
    });
    user.click(memberInfoExpandButton);
    expect(await within(memberInfoCard).findByText(/Referral code/)).toBeVisible();
    //open regenerate referral code modal
    user.click(await screen.findByRole('button', {name: /REGENERATE REFERRAL CODE/}));
    expect(await screen.findByText(`Are you sure want to regenerate referral code?`)).toBeVisible();
    const cancelRegenerateReferralCodeDialogBtn = await screen.findByRole('button', {
      name: /CANCEL/,
    });
    expect(cancelRegenerateReferralCodeDialogBtn).toBeVisible();
    expect(await screen.findByRole('button', {name: /CONFIRM/})).toBeVisible();
    user.click(cancelRegenerateReferralCodeDialogBtn);
    expect(cancelRegenerateReferralCodeDialogBtn).not.toBeVisible();
  });
  it('can view referral and referrer section', async () => {
    renderWithConfig(<CustomerRewards userId="d812d91d-fd8b-48d9-b889-25150c93c38f" />);
    const referralsCardHeading = await screen.findByTestId(/referrals-card-heading/);
    const referralsExpandButton = await within(referralsCardHeading).findByRole('button', {
      expanded: false,
    });
    user.click(referralsExpandButton);
    expect(
      await within(await screen.findByTestId(/referrals-table/)).findByText(/FULL NAME/),
    ).toBeVisible();

    const referrerCardHeading = await screen.findByTestId(/referrer-card-heading/);
    const referrerExpandButton = await within(referrerCardHeading).findByRole('button', {
      expanded: false,
    });
    user.click(referrerExpandButton);
    expect(
      await within(await screen.findByTestId(/referrer-table/)).findByText(/PHONE NUMBER/),
    ).toBeVisible();
  });

  it(`can view user's goals and edit endDate`, async () => {
    renderWithConfig(<CustomerRewards userId="d812d91d-fd8b-48d9-b889-25150c93c38f" />);
    const goalsCardHeading = await screen.findByTestId(/goals-card-heading/);
    const goalsExpandButton = await within(goalsCardHeading).findByRole('button', {
      expanded: false,
    });
    user.click(goalsExpandButton);
    const goalsTable = await screen.findByTestId(/goals-table/);
    expect(await within(goalsTable).findByText(/CAMPAIGN NAME/)).toBeVisible();
    const editEndDateButton = await within(goalsTable).findByRole('button', {name: /EDIT DETAILS/});
    //open modal
    user.click(editEndDateButton);
    const editEndDateModal = await screen.findByTestId(/edit-end-date-modal/);
    expect(await within(editEndDateModal).findByText(/Edit details/)).toBeVisible();
    //cannot edit endDate before current time
  });
});
