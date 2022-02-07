import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';
import {LoyaltyCategoryDetails} from './loyalty-category-details';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyCategoryDetails />', () => {
  it('renders page accordingly', () => {
    renderWithConfig(<LoyaltyCategoryDetails code="A201" />);

    expect(screen.getByText('Category details')).toBeDefined();
    expect(screen.getByTestId('edit-button')).toBeDefined();
  });

  it('renders accordingly when data is received', async () => {
    renderWithConfig(<LoyaltyCategoryDetails code="A201" />);

    const codeNode = await screen.findByText('A201');

    expect(codeNode).toBeDefined();
    expect(screen.getByText('Category details')).toBeDefined();
    expect(screen.getByTestId('edit-button')).toBeDefined();
    expect(screen.getByText('Category name')).toBeDefined();
    expect(screen.getByText('Code')).toBeDefined();
    expect(screen.getByText('Description')).toBeDefined();
  });

  it('renders edit modal accordingly', async () => {
    renderWithConfig(<LoyaltyCategoryDetails code="A201" />);

    await screen.findByText('A201');

    const editButton = screen.getByTestId('edit-button');
    expect(editButton).toBeDefined();
    user.click(editButton);

    const createFields = await screen.findByTestId('create-update-fields');
    expect(createFields).toBeDefined();
    expect(screen.queryByText('Edit category')).toBeDefined();
    expect(within(createFields).getByText('Category name')).toBeDefined();
    expect(within(createFields).getByText('Code')).toBeDefined();
    expect(within(createFields).getByText('Description')).toBeDefined();
    expect(screen.getByTestId('cancel-button')).toBeDefined();
    expect(screen.getByTestId('save-button')).toBeDefined();
    expect(screen.getByRole('button', {name: /SAVE CHANGES/i})).toBeDefined();
  });

  it('renders delete modal accordingly', async () => {
    renderWithConfig(<LoyaltyCategoryDetails code="A201" />);

    await screen.findByText('A201');

    const editButton = screen.getByTestId('edit-button');
    expect(editButton).toBeDefined();
    user.click(editButton);

    const deleteButton = await screen.findByRole('button', {name: /DELETE/i});
    user.click(deleteButton);
    const deleteBody = await screen.findByTestId('delete-modal-body');

    expect(deleteButton).toBeDefined();
    expect(deleteBody).toBeDefined();

    expect(
      within(deleteBody).getByText(
        'This action cannot be undone and you will not be able to recover any data.',
      ),
    ).toBeDefined();
  });
});
