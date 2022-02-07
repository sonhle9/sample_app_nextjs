import {screen, within, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {RewardCampaignListing} from './reward-campaign-listing';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('RewardCampaignListing', () => {
  it('works', async () => {
    renderWithConfig(<RewardCampaignListing />);

    expect(await screen.findByText(/records to display/i)).toBeVisible();

    const table = within(await screen.findByRole('grid'));
    (await table.findAllByText(/active/i)).forEach((item) => {
      expect(item).toBeVisible();
    });

    // Create campaign
    user.click(screen.getByRole('button', {name: /create/i}));
    user.type(screen.getByRole('textbox', {name: /Campaign title/i}), 'Test create campaign');

    user.click(screen.getByRole('button', {name: /category/i}));
    user.click(
      await screen.findByRole('option', {
        name: /mission/i,
        hidden: true,
      }),
    );

    user.click(screen.getByTestId('startDate'));
    // click on first date in day picker popup
    user.click((await screen.findAllByRole('gridcell', {hidden: true}))?.[0]);

    expect(await screen.findByText(/should have at least one goal/i)).toBeVisible();
    user.click(screen.getByRole('button', {name: /add goal/i}));
    user.type(screen.getByRole('textbox', {name: /goal title/i}), 'Goal 1');
    user.type(screen.getByRole('textbox', {name: /goal description/i}), 'Goal description');

    expect(await screen.findByText(/should have at least one reward/i)).toBeVisible();
    user.click(screen.getByRole('button', {name: /add reward/i}));
    const rewardSection = within(screen.getByLabelText(/goals.\d.consequence/i));
    user.click(rewardSection.getByRole('button', {name: /reward type/i}));
    user.click(await screen.findByRole('option', {name: /cashback/i}));
    user.type(rewardSection.getByRole('textbox', {name: /value/i}), '30');

    expect(await screen.findByText(/should have at least one criteria/i)).toBeVisible();
    user.click(screen.getByRole('button', {name: /add criteria/i}));
    const criteriaSection = within(screen.getByLabelText(/goals.\d.criteria/i));
    user.click(criteriaSection.getByRole('button', {name: /criteria type/i}));
    user.click(await screen.findByRole('option', {name: /Petrol purchase amount/i}));
    user.type(criteriaSection.getByRole('textbox', {name: /description/i}), 'fuel amount');
    user.type(criteriaSection.getByRole('textbox', {name: /target/i}), '30');

    user.click(screen.getByRole('button', {name: /save/i}));
    await waitForElementToBeRemoved(() => {
      return screen.queryByRole('button', {name: /save/i});
    });

    expect(await screen.findByText('Test create campaign')).toBeInTheDocument();
  }, 120000);
});
