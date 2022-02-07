import {screen, within, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {RewardCampaignDetails} from './reward-campaign-details';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('RewardCampaignDetails', () => {
  const id = '60ab19a99fe2920010a685a9';
  it('renders general, json, and customers sections', async () => {
    renderWithConfig(<RewardCampaignDetails id={id} />);

    const generalSection = within(screen.getByTestId('general'));

    expect(generalSection.getByText(/campaign title/i)).toBeVisible();
    expect(await generalSection.findByText(/pfc campaign/i)).toBeVisible();
    expect(generalSection.getByText(/active/i)).toBeVisible();

    expect(generalSection.getByText(/description/i)).toBeVisible();
    expect(generalSection.getByText(/Be a Mesra Elite member/i)).toBeVisible();

    expect(generalSection.getByText(/start date/i)).toBeVisible();
    expect(generalSection.getByText(/24 May 2021/i)).toBeVisible();

    expect(generalSection.getByText(/codes/i)).toBeVisible();
    expect(generalSection.getByText(/c-test-code/i)).toBeVisible();

    expect(generalSection.getByText(/targeting/i)).toBeVisible();
    expect(generalSection.getByText(/New customer/i)).toBeVisible();

    const jsonSection = within(screen.getByTestId('json'));
    user.click(jsonSection.getByRole('button', {name: /expand/i}));
    expect(jsonSection.getByText('60ab19a99fe2920010a685a9')).toBeVisible();

    const customersHeading = within(screen.getByTestId('customers-heading'));
    user.click(customersHeading.getByRole('button', {name: /expand/i}));

    const customersTable = within(screen.getByTestId('customers'));
    (await customersTable.findAllByText(/Vehicle Brand/i)).forEach((item) => {
      expect(item).toBeVisible();
    });
  });

  it('downloads campaign customers csv', async () => {
    let downloadReq;
    server.use(
      rest.post(
        `${environment.rewardsApiBaseUrl}/api/rewards/campaigns/${id}/members/csv`,
        (req, res, ctx) => {
          downloadReq = req;
          return res(ctx.body('csv'));
        },
      ),
    );
    renderWithConfig(<RewardCampaignDetails id={id} />);
    const customersHeading = within(screen.getByTestId('customers-heading'));
    user.click(customersHeading.getByRole('button', {name: /expand/i}));
    user.click(await screen.findByRole('button', {name: /download csv/i}));
    await waitFor(() => expect(downloadReq).toBeDefined());
  });

  it('can edit campaign details', async () => {
    renderWithConfig(<RewardCampaignDetails id={id} />);
    const campaignTitle = 'Test edit campaign';

    const editButton = screen.getByRole('button', {name: /edit/i});
    await waitFor(() => expect(editButton).toBeEnabled());
    user.click(editButton);

    const titleTextbox = screen.getByRole('textbox', {name: /Campaign title/i});
    user.clear(titleTextbox);
    user.type(titleTextbox, campaignTitle);

    user.click(await screen.findByRole('button', {name: /save/i}));
    await waitForElementToBeRemoved(() => {
      return screen.queryByRole('button', {name: /save/i});
    });

    (await screen.findAllByText(campaignTitle)).forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });
});
