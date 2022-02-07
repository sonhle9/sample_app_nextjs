import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';
import {LoyaltyMemberDetails} from './loyalty-member-details';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyMemberDetails />', () => {
  it(
    'renders page accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f753e0b3127f000110aa682" />);

      await screen.findByText('ysdy@gf.com');

      expect(screen.getByText('Member information'));
      expect(screen.getByText('Name'));
      expect(screen.getByText('dty'));
      expect(screen.getByText('ysdy@gf.com'));
      expect(screen.getByText('0001'));
      expect(screen.getByText('Activated on'));

      const pointSummary = await screen.findByTestId('loyalty-point-summary');

      expect(pointSummary).toBeDefined();

      expect(within(pointSummary).getByText('GENERAL')).toBeDefined();

      expect(within(pointSummary).getByText('Point balance')).toBeDefined();

      expect(await within(pointSummary).findByText('105 pts')).toBeDefined();

      const pointDetails = await screen.findByTestId('member-point-details');

      await screen.findAllByTestId('members-points-row');

      expect(within(pointDetails).getByText('Point transactions'));
      expect(within(pointDetails).queryAllByTestId('members-points-row').length).toBe(3);

      const cardSummary = await screen.findByTestId('loyalty-card-summary');

      expect(within(cardSummary).getByText('7083815-61233-22811'));
      expect(within(cardSummary).getByText('Virtual'));
    }),
  );

  it(
    'opens the edit modal accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f753e0b3127f000110aa682" />);

      const manageMember = await screen.findByRole('button', {name: /MANAGE MEMBER/i});

      expect(manageMember).toBeDefined();

      user.click(manageMember);

      user.click(screen.getByText('Update member information'));

      const editModal = screen.getByTestId('edit-member-modal');

      expect(within(editModal).getAllByText('Name')).toBeDefined();
      expect(within(editModal).getAllByText('Phone number')).toBeDefined();
      expect(within(editModal).getAllByText('Email')).toBeDefined();
      expect(within(editModal).getAllByText('Address')).toBeDefined();
      expect(within(editModal).getAllByText('City')).toBeDefined();
    }),
  );

  it(
    'opens the programme modal accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f753e0b3127f000110aa682" />);

      const manageMember = await screen.findByRole('button', {name: /MANAGE MEMBER/i});

      expect(manageMember).toBeDefined();

      user.click(manageMember);

      user.click(screen.getByText('Programme'));

      const programmeModal = screen.getByTestId('programme-modal');

      expect(within(programmeModal).getAllByText('AXXESS (PA)')).toBeDefined();
      expect(within(programmeModal).getAllByText('Opt out reason')).toBeDefined();
      expect(within(programmeModal).getAllByText('Points retained')).toBeDefined();
    }),
  );

  it(
    'opens the change status modal accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f753e0b3127f000110aa682" />);

      user.click(await screen.findByRole('button', {name: /MANAGE MEMBER/i}));

      expect(screen.getByText('Change loyalty status')).toBeDefined();

      user.click(screen.getByText('Change loyalty status'));

      const changeStatusModal = await screen.findByTestId('card-status-modal');
      await screen.findByDisplayValue('7083815-61233-22811');

      expect(within(changeStatusModal).getByText('Change loyalty status'));
      expect(within(changeStatusModal).getByDisplayValue('7083815-61233-22811'));

      expect(within(changeStatusModal).getByRole('button', {name: /Select any status/i}));
    }),
  );

  it(
    'opens the programme modal accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f753e0b3127f000110aa682" />);

      user.click(await screen.findByRole('button', {name: /MANAGE MEMBER/i}));

      expect(screen.getByText('Programme')).toBeDefined();

      user.click(screen.getByText('Programme'));

      const programmeModal = await screen.findByTestId('programme-modal');

      expect(within(programmeModal).getByText('Opt'));
      expect(within(programmeModal).getByText('AXXESS (PA)'));
      expect(within(programmeModal).getByText('Opt in on'));
      expect(within(programmeModal).getByText('Opt out reason'));
      expect(within(programmeModal).getByText('Opt out on'));
      expect(within(programmeModal).getByText('Points retained'));
    }),
  );

  it(
    'renders no cards and open modal accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f9676cc9e6d8400106830f4" />);

      const cardSummary = await screen.findByTestId('loyalty-card-summary');

      expect(within(cardSummary).getByText('No mesra card linked yet'));

      const getCard = await screen.findByRole('button', {name: /GET A CARD/i});

      user.click(getCard);

      const modal = await screen.findByTestId('confirm-link-modal');

      expect(within(modal).getByText('Confirm granting a new virtual card'));
      expect(
        within(modal).getByText(
          'Do you want to proceed with granting member with a new virtual card',
        ),
      );

      // user.click(within(modal).getByLabelText('Link to physical card'));
      // expect(within(modal).getByText('Card number'));

      // user.type(within(modal).getByPlaceholderText('Insert card number'), '70838156123322811');

      // const linkedError = await within(modal).findByText(
      //   'This card is already linked to another member',
      // );

      // expect(linkedError).toBeDefined();
    }),
  );

  it(
    'opens unlink card dialog accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f753e0b3127f000110aa682" />);

      const cardSummary = await screen.findByTestId('loyalty-card-summary');

      expect(cardSummary).toBeDefined();

      const manageCard = await screen.findByRole('button', {name: /MANAGE CARD/i});

      expect(manageCard).toBeDefined();

      user.click(manageCard);

      expect(screen.getByText('Unlink card')).toBeDefined();
      expect(screen.getByText('Unlinked card history')).toBeDefined();

      user.click(screen.getByText('Unlink card'));

      const unlinkModal = await screen.findByTestId('unlink-card-modal');

      expect(within(unlinkModal).getByText('Confirm unlinking card')).toBeDefined();

      expect(
        within(unlinkModal).getByText('Do you want to proceed with unlinking this card?'),
      ).toBeDefined();
    }),
  );

  it(
    'opens unlink card history modal accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f753e0b3127f000110aa682" />);

      const cardSummary = await screen.findByTestId('loyalty-card-summary');

      expect(cardSummary).toBeDefined();

      const manageCard = await screen.findByRole('button', {name: /MANAGE CARD/i});

      expect(manageCard).toBeDefined();

      user.click(manageCard);

      expect(screen.getByText('Unlink card')).toBeDefined();
      expect(screen.getByText('Unlinked card history')).toBeDefined();

      user.click(screen.getByText('Unlinked card history'));

      const unlinkModal = await screen.findByTestId('unlink-card-history-modal');

      const mesraCard = await within(unlinkModal).findAllByText('7083157-77777-79115');

      expect(mesraCard.length).toBe(2);
    }),
  );

  it(
    'opens point transfer modal accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f753e0b3127f000110aa682" />);

      const pointSummary = await screen.findByTestId('loyalty-point-summary');

      expect(pointSummary).toBeDefined();

      const createTransaction = await screen.findByRole('button', {name: /CREATE TRANSACTION/i});

      expect(createTransaction).toBeDefined();

      user.click(createTransaction);

      expect(screen.getByText('Point transfer')).toBeDefined();

      user.click(screen.getByText('Point transfer'));

      const transferModal = await screen.findByTestId('point-transfer-modal');

      expect(within(transferModal).getByText('Transfer to')).toBeDefined();
      expect(within(transferModal).getByText('Amount')).toBeDefined();
      expect(within(transferModal).getByText('Description')).toBeDefined();

      const submitButton = within(transferModal).getByRole('button', {name: /SUBMIT/i});

      expect(submitButton).toBeDefined();
      expect(submitButton.hasAttribute('disabled')).toBe(true);
    }),
  );

  it(
    'opens point adjustment modal accordingly',
    suppressConsoleLogs(async () => {
      renderWithConfig(<LoyaltyMemberDetails id="5f753e0b3127f000110aa682" />);

      const pointSummary = await screen.findByTestId('loyalty-point-summary');

      expect(pointSummary).toBeDefined();

      const createTransaction = await screen.findByRole('button', {name: /CREATE TRANSACTION/i});

      expect(createTransaction).toBeDefined();

      user.click(createTransaction);

      expect(screen.getByText('Point adjustment')).toBeDefined();

      user.click(screen.getByText('Point adjustment'));

      const transferModal = await screen.findByTestId('point-adjustment-modal');

      expect(within(transferModal).getByText('Amount')).toBeDefined();
      expect(within(transferModal).getByText('Adjustment type')).toBeDefined();
      expect(within(transferModal).getByText('Remark')).toBeDefined();
      expect(within(transferModal).getByText('Attachment')).toBeDefined();

      const submitButton = within(transferModal).getByRole('button', {
        name: /SUBMIT FOR APPROVAL/i,
      });

      expect(submitButton).toBeDefined();
      expect(submitButton.hasAttribute('disabled')).toBe(true);

      user.type(within(transferModal).getByTestId('amount-input'), '100');
      user.click(within(transferModal).getByTestId('adjustment-type'));

      const grantSelection = await screen.findByText('Grant loyalty points (CR)');

      expect(grantSelection).toBeDefined();
    }),
  );
});
