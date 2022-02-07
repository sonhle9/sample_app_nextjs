import * as React from 'react';
import {screen} from '@testing-library/react';
import {formatDate} from '@setel/portal-ui';

import {server} from '../../../../services/mocks/mock-server';
import {renderWithConfig} from '../../../../lib/test-helper';
import {CustomerRiskProfile} from './customer-risk-profile';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`CustomerRiskProfile`, () => {
  it('renders customer risk profile', async () => {
    renderWithConfig(<CustomerRiskProfile userId={'059bf1a8-a494-4147-9adf-4b5871b679d6'} />);

    expect(await screen.findByText('ebc32536-8545-4fcb-b4cc-3d85968285ed')).toBeDefined();
    expect(await screen.findByText('Ekyc Verification')).toBeDefined();
    expect(await screen.findByText('High')).toBeDefined();
    expect(
      await screen.findByText(formatDate('2021-06-26T07:03:19.807Z', {formatType: 'dateAndTime'})),
    ).toBeDefined();
  });
});
