import {cleanup, screen, within} from '@testing-library/react';
import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {SetelShareDetailsTransactions} from './setelshare-details-transactions';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';

describe(`<SetelShareDetailsTransactions />`, () => {
  const circleId = 'circleId';
  const getCircleTransactionsById = `${environment.circleBaseUrl}/api/circles/admin/circles/${circleId}/transactions`;

  const cardComponent = <SetelShareDetailsTransactions circleId={circleId} />;

  afterAll(() => {
    cleanup();
  });

  it('should renders card', async () => {
    server.use(rest.get(getCircleTransactionsById, (_, res, ctx) => res(ctx.json([]))));
    renderWithConfig(cardComponent);
    const card = within(screen.getByTestId('setelshare-details-transactions'));
    expect(await card.findByText('Transactions')).toBeDefined();
    expect(await card.findAllByTestId('setelshare-transaction-listing')).toBeDefined();
  });
});
