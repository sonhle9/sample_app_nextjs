import * as React from 'react';
import {screen, waitFor, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {ReferralLeaderboardListing} from './rewards-leaderboard-listing';

describe(`<ReferralLeaderboardListing />`, () => {
  it(
    'downloads csv',
    suppressConsoleLogs(async () => {
      let downloadReq;
      server.use(
        rest.post(
          `${environment.storeApiBaseUrl}/api/rewards/admin/leaderboard/csv`,
          (req, res, ctx) => {
            downloadReq = req;
            return res(ctx.body('csv'));
          },
        ),
      );
      renderWithConfig(<ReferralLeaderboardListing />);
      user.click(await screen.findByRole('button', {name: /DOWNLOAD CSV/}));
      await waitFor(() => expect(downloadReq).toBeDefined());
    }),
  );

  it('renders table and able to filter', async () => {
    server.listen({
      onUnhandledRequest: 'error',
    });
    renderWithConfig(<ReferralLeaderboardListing />);
    const filterControl = await screen.findByTestId(/filter-control/);

    expect(await within(filterControl).findByRole('button', {name: /Tags/})).toBeVisible();
    //enter some tags
    const tagsInput = (await screen.findAllByTestId(/tags-input/)) as HTMLInputElement[]; // filter
    user.type(tagsInput[0], 'test001,test002,');
    const emptyTableMessage = await screen.findByText(/You have no data to be displayed here/);
    expect(emptyTableMessage).toBeVisible();
    const dropdownButton = await within(filterControl).findByTestId(/filter-type-dropdown/);
    user.click(dropdownButton);
    const referralCodeOption = await screen.findByRole('option', {name: /Referral code/});
    user.click(referralCodeOption);
    const referralCodeInput = (await screen.findAllByTestId(
      /referral-code-input/,
    )) as HTMLInputElement[];
    user.type(referralCodeInput[0], 'wb2q{enter}');
    expect((await screen.findAllByTestId(/leaderboard-table-row/g)).length).not.toBe(20);
  });
});
