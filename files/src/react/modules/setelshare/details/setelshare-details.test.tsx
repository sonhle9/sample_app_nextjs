import {cleanup, screen, within} from '@testing-library/react';
import {rest} from 'msw';
import React from 'react';
import {environment} from 'src/environments/environment';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {SetelShareDetails} from './setelshare-details';

describe(`<SetelShareDetails />`, () => {
  const circleId = 'circleId';
  const getCircleById = `${environment.circleBaseUrl}/api/circles/admin/circles/${circleId}`;
  const getCircleTransactionsById = `${environment.circleBaseUrl}/api/circles/admin/circles/${circleId}/transactions`;

  const containerComponent = <SetelShareDetails id={circleId} />;

  afterAll(() => {
    cleanup();
  });

  it('should renders card', async () => {
    server.use(rest.get(getCircleById, (_, res, ctx) => res(ctx.json({}))));
    server.use(rest.get(getCircleTransactionsById, (_, res, ctx) => res(ctx.json([]))));
    renderWithConfig(containerComponent);
    const container = within(screen.getByTestId('setelshare-details'));
    expect(await container.findByText('Setel Share Details')).toBeDefined();
    expect(await container.findByTestId('setelshare-details-general')).toBeDefined();
    expect(await container.findByTestId('setelshare-details-members')).toBeDefined();
    expect(await container.findByTestId('setelshare-details-transactions')).toBeDefined();
  });
});
