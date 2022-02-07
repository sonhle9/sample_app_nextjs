import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {renderWithConfig} from '../../../lib/test-helper';
import {RiskProfileListing} from './risk-profile-listing';

describe(`<RiskProfileListing />`, () => {
  it('renders list', async () => {
    renderWithConfig(<RiskProfileListing />);

    const withinStoreList = within(screen.getByTestId('risk-profile-listing'));

    expect(await withinStoreList.findByText(/Account ID/i)).toBeDefined();
    expect(await withinStoreList.findByText(/ID Number/i)).toBeDefined();
    expect(await withinStoreList.findAllByText(/Created On/i)).toBeDefined();
    expect(await withinStoreList.findByText(/Updated On/i)).toBeDefined();
  });

  it('renders empty state', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/risk-profiles/risk-profiles`, (_, res, ctx) => {
        return res(ctx.json([]));
      }),
    );
    renderWithConfig(<RiskProfileListing />);

    expect(await screen.findByText(/No data to be displayed./i)).toBeDefined();
  });
});
