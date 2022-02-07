import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';
import {PointExpiries} from './point-expiries';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';

const apiCard = `${environment.cardsApiBaseUrl}/api/cards/admin`;

const MOCK_CARD_CATEGORIES = [
  {
    name: 'Card group',
    description: '',
    level: 'enterprise',
    merchantId: '',
    createdBy: 'd3ee34b4-3df1-47cd-8703-57fa5b097175',
    createdAt: '2021-02-09T09:02:41.745Z',
    updatedAt: '2021-02-09T09:02:41.745Z',
    id: '60224fb15402b100102e0b78',
    merchant: null,
  },
  {
    limitations: {allowedFuelProducts: []},
    cardType: 'loyalty',
    merchantId: null,
    name: 'ytu',
    description: 'tyu',
    level: 'enterprise',
    createdBy: 'd3ee34b4-3df1-47cd-8703-57fa5b097175',
    createdAt: '2020-12-16T08:57:41.653Z',
    updatedAt: '2020-12-16T08:57:41.653Z',
    id: '5fd9cc050efb320010138413',
    merchant: null,
  },
  {
    limitations: {allowedFuelProducts: []},
    name: 'PDB Grab',
    description: 'Grab 2 X points',
    level: 'enterprise',
    cardType: 'loyalty',
    createdAt: '2020-09-09T08:01:07.730Z',
    updatedAt: '2020-09-09T08:01:07.730Z',
    id: '5f588bc3e292c000114630a8',
    merchant: null,
  },
  {
    limitations: {allowedFuelProducts: []},
    name: 'e',
    description: 'name okk',
    level: 'enterprise',
    cardType: 'loyalty',
    merchantId: '2',
    createdAt: '2020-07-30T04:35:12.313Z',
    updatedAt: '2020-08-05T03:01:23.894Z',
    updatedBy: null,
    id: '5f224e000b044a001007eb6e',
    merchant: null,
  },
  {
    limitations: {allowedFuelProducts: []},
    name: 'Group D',
    description: 'Group D',
    level: 'enterprise',
    cardType: 'loyalty',
    merchantId: null,
    createdAt: '2020-07-27T08:30:01.407Z',
    updatedAt: '2020-07-27T08:30:01.407Z',
    id: '5f1e90895aab900010479ec0',
    merchant: null,
  },
];

describe('<PointExpiries />', () => {
  beforeEach(() => {
    server.use(
      rest.get(`${apiCard}/card-groups`, (_, res, ctx) => {
        return res(ctx.json(MOCK_CARD_CATEGORIES));
      }),
      rest.get(`${apiCard}/card-groups/:id`, (req, res, ctx) => {
        const {id} = req.params;
        return res(ctx.json(MOCK_CARD_CATEGORIES.find((cardCategory) => cardCategory.id === id)));
      }),
    );
  });

  it('renders page accordingly', async () => {
    renderWithConfig(<PointExpiries />);

    expect(screen.getByText('Point expiries')).toBeDefined();

    const expiryEntries = await screen.findAllByTestId('point-expiry-entry');

    expect(expiryEntries.length).toBe(3);

    expect(screen.getAllByText('Card group')).toBeDefined();
  });

  it('renders create modal accordingly', async () => {
    renderWithConfig(<PointExpiries />);

    expect(screen.getByText('Point expiries')).toBeDefined();

    const createButton = screen.getByRole('button', {name: /CREATE/i});
    expect(createButton).toBeDefined();
    await screen.findAllByTestId('point-expiry-entry');

    user.click(createButton);

    expect(await screen.findByTestId('create-edit-expiry-modal')).toBeDefined();
    expect(screen.getByText('Create loyalty point expiries')).toBeDefined();
    expect(screen.getAllByText('PDB Grab')).toBeDefined();

    user.click(screen.getByTestId('cancel-button'));
  });

  it('renders edit modal accordingly', async () => {
    renderWithConfig(<PointExpiries />);

    expect(screen.getByText('Point expiries')).toBeDefined();
    const expiryEntries = await screen.findAllByTestId('point-expiry-entry');

    user.click(expiryEntries[0]);

    const editModal = await screen.findByTestId('create-edit-expiry-modal');

    expect(editModal).toBeDefined();
    expect(within(editModal).getByText('Edit loyalty point expiries')).toBeDefined();

    const dayInput = within(editModal).getByLabelText(/Validity days/i) as HTMLInputElement;

    expect(dayInput).toBeDefined();

    expect(dayInput.value).toBe('1,235');
    expect(within(editModal).queryAllByText('Fuel earnings')).toBeDefined();

    user.click(screen.getByTestId('cancel-button'));
  });
});
