import {rest} from 'msw';
import * as React from 'react';
import {fireEvent, screen, within} from '@testing-library/dom';
import {environment} from 'src/environments/environment';
import {createMockData, createPaginationHandler} from 'src/react/lib/mock-helper';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {CustomerListing} from './customers-listing';

const baseUrl = `${environment.opsApiBaseUrl}/api/ops`;

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});

afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe('Customer Listing', () => {
  const setupComponent = async () => {
    renderWithConfig(<CustomerListing />);
  };

  it(
    'should render Accounts heading, Search Input and Table',
    suppressConsoleLogs(async () => {
      await setupComponent();
      const searchInput = screen.getAllByLabelText('Search', {selector: 'input'})[1];

      expect(screen.getByText(/Accounts/i)).toBeInTheDocument();
      expect(searchInput).toBeInTheDocument();

      // check if search bar is usable
      fireEvent.change(searchInput, {target: {value: 'Mega Test'}});
      expect(within(searchInput).findByText('Mega Test'));
      fireEvent.keyDown(searchInput, {key: 'Enter', code: 'Enter'});

      // check if table has results and can find Mega Test
      const table = screen.getByTestId('customers-listing-table');
      expect(table).toBeInTheDocument();
      expect(within(table).findByText('Mega Test'));
    }),
  );
  it('should render Name, Phone Number, Email, Tier and Created On ', async () => {
    await setupComponent();
    expect(await screen.findByText(/Name/i)).toBeInTheDocument();
    expect(await screen.findByText(/Phone Number/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email/i)).toBeInTheDocument();
    expect(await screen.findByText(/Tier/i)).toBeInTheDocument();
    expect(await screen.findByText(/Created On/i)).toBeInTheDocument();
  });

  it(
    'should show alert if api returns error ',
    suppressConsoleLogs(async () => {
      // mock server response with status 500
      server.use(rest.get(`${baseUrl}/users`, (_, res, ctx) => res(ctx.status(500))));

      const result = renderWithConfig(<CustomerListing />);

      expect(await result.findByText('Server error! Please try again.')).toBeVisible();
    }),
  );

  it('should show at least one row of item', async () => {
    server.use(
      rest.get(
        `${baseUrl}/users`,
        createPaginationHandler(() => {
          return createMockData(
            [
              {
                id: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
                email: 'megatest943@setel.my',
                tierTitle: 'Level 1',
                internal: false,
                name: 'Megatest',
                phone: '601666999943',
                createdAt: '2021-02-12T13:47:41.630Z',
              },
            ],
            1,
          );
        }),
      ),
    );

    await setupComponent();
    const table = screen.getByTestId('customers-listing-table');

    expect(table).toBeInTheDocument();
    expect((await within(table).findAllByText('Megatest')).length).toBeGreaterThan(0);
    expect(within(table).getByText('megatest943@setel.my')).toBeInTheDocument();
    expect((await within(table).findAllByText('Level 1')).length).toBeGreaterThan(0);
    expect(within(table).getByText('2021-02-12T13:47:41.630Z')).toBeInTheDocument();
  });

  it('should show error is data is empty', async () => {
    server.use(
      rest.get(
        `${baseUrl}/users`,
        createPaginationHandler(() => {
          return createMockData(null, null);
        }),
      ),
    );

    const result = renderWithConfig(<CustomerListing />);
    const table = screen.getByTestId('customers-listing-table');

    expect(table).toBeInTheDocument();
    expect(await result.findByText('No users found')).toBeVisible();
  });
});
