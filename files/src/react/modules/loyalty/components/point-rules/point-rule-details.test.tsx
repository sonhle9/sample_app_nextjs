import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {rest} from 'msw';
import user from '@testing-library/user-event';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {PointRuleDetails} from './point-rule-details';
import {OperationType} from '../../point-rules.type';
import {server} from 'src/react/services/mocks/mock-server';
import {environment} from 'src/environments/environment';

const cardsApiBaseUrl = `${environment.cardsApiBaseUrl}/api/cards`;

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`<PointRuleDetails />`, () => {
  it('renders earning details accordingly', async () => {
    server.use(
      rest.get(`${cardsApiBaseUrl}/admin/card-groups`, (_, res, ctx) => res(ctx.json([]))),
    );

    renderWithConfig(
      <PointRuleDetails id={'6094d53c0b4863001857c7b2'} operationType={OperationType.EARN} />,
    );

    const cardCategories = screen.queryAllByTestId('card-category');
    const loyaltyCategories = screen.queryAllByTestId('loyalty-category');

    expect(cardCategories.length).toBe(0);
    expect(loyaltyCategories.length).toBe(0);

    // expect(cardCategories.length).toBe(2);

    expect(screen.getByText('Priority')).toBeDefined();
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('Card groups')).toBeDefined();
    expect(screen.getByText('Loyalty categories')).toBeDefined();
    expect(screen.getByText('Source type')).toBeDefined();
    expect(screen.getByText('Source')).toBeDefined();
    expect(screen.getByText('Target type')).toBeDefined();
    expect(screen.getByText('Target')).toBeDefined();
    expect(screen.getByText('Rate')).toBeDefined();
    expect(screen.getByText('Start date')).toBeDefined();
    expect(screen.getByText('End date')).toBeDefined();
    expect(screen.getByText('Remarks')).toBeDefined();

    user.click(screen.getByRole('button', {name: /EDIT/}));

    const $modal = screen.getByTestId('create-update-modal');

    expect(within($modal).getByText('Status')).toBeDefined();
    expect(within($modal).getByText('Priority')).toBeDefined();
  });

  it('renders redemption details accordingly', async () => {
    server.use(
      rest.get(`${cardsApiBaseUrl}/admin/card-groups`, (_, res, ctx) => res(ctx.json([]))),
    );

    renderWithConfig(
      <PointRuleDetails id={'5f73f1f68b92fd00171051c9'} operationType={OperationType.REDEMPTION} />,
    );

    const rate = await screen.findAllByText('0.01');

    expect(rate).toBeDefined();

    const status = screen.queryAllByText('Status');

    expect(status.length > 1);
    expect(screen.getByText('Priority')).toBeDefined();
    expect(screen.getByText('Source')).toBeDefined();
    expect(screen.getByText('Target type')).toBeDefined();
    expect(screen.getByText('Target')).toBeDefined();
    expect(screen.getByText('Rate')).toBeDefined();
    expect(screen.getByText('Start date')).toBeDefined();
    expect(screen.getByText('End date')).toBeDefined();
    expect(screen.getByText('Remarks')).toBeDefined();
  });
});
