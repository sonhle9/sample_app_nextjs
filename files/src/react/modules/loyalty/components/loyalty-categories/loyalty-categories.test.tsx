import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';
import {LoyaltyCategories} from './loyalty-categories';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyCategories />', () => {
  it('renders page accordingly', () => {
    renderWithConfig(<LoyaltyCategories />);

    expect(screen.getByText('Categories')).toBeDefined();
    expect(screen.getByTestId('create-button')).toBeDefined();
  });

  it('renders accordingly when data is received', async () => {
    renderWithConfig(<LoyaltyCategories />);

    const categories = await screen.findAllByTestId('categories');
    expect(categories.length).toBe(4);

    expect(screen.getByText('Categories')).toBeDefined();
    expect(screen.getByTestId('create-button')).toBeDefined();
  });

  it('renders create modal accordingly', async () => {
    renderWithConfig(<LoyaltyCategories />);

    await screen.findAllByTestId('categories');

    const createButton = screen.getByTestId('create-button');
    expect(createButton).toBeDefined();
    user.click(createButton);

    const createFields = await screen.findByTestId('create-update-fields');
    expect(createFields).toBeDefined();
    expect(within(createFields).getByText('Category name')).toBeDefined();
    expect(within(createFields).getByText('Code')).toBeDefined();
    expect(within(createFields).getByText('Description')).toBeDefined();
    expect(screen.getByTestId('cancel-button')).toBeDefined();
    expect(screen.getByTestId('save-button')).toBeDefined();
    expect(screen.getByRole('button', {name: /SAVE/i})).toBeDefined();
  });
});
