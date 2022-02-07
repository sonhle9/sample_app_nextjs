import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {cleanup, screen} from '@testing-library/react';
import {TerminalsListingTabs} from './terminals-listing-tab';

jest.setTimeout(100000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());

describe('<TerminalsListingTabs />', () => {
  it('render correctly', async () => {
    renderWithConfig(<TerminalsListingTabs />);

    expect(await screen.findByText(/Setel Terminal/)).toBeDefined();
    expect(await screen.findByText(/Invenco Terminal/)).toBeDefined();
    expect(await screen.findByText(/IMPORT SERIAL NO./)).toBeDefined();
  });
});
