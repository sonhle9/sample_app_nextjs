import {screen, within} from '@testing-library/dom';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {CustomerBudget} from './budget';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

//1st scenario
describe(`Customer's Budget`, () => {
  //expand customer's budget table
  it('It can open budget table', async () => {
    renderWithConfig(<CustomerBudget userId={`d812d91d-fd8b-48d9-b889-25150c93c38f`} />);
    const budgetHeading = await screen.findByTestId(/budget-card-heading/);
    const expandTableButton = await within(budgetHeading).findByRole('button', {expanded: false});

    //expand budget table
    user.click(expandTableButton);

    expect(await screen.findByText(/MONTH/i)).toBeDefined();
    expect(await screen.findByText(/TOTAL AMOUNT/i)).toBeDefined();
    expect(await screen.findByText(/TOTAL LITRES/i)).toBeDefined();
    expect(await screen.findByText(/TOTAL PURCHASES/i)).toBeDefined();

    expect(await screen.findByText(/Jan 2020/)).toBeDefined();
    expect(await screen.findByText(/181.80/)).toBeDefined();
    expect(await screen.findByText(/360.00/)).toBeDefined();
    expect(await screen.findByText(/73/)).toBeDefined();
  });

  //expand expandable customer's budget row in table
  it('It can open expandable row in table', async () => {
    renderWithConfig(<CustomerBudget userId={`d812d91d-fd8b-48d9-b889-25150c93c38f`} />);
    const budgetHeading = await screen.findByTestId(/budget-card-heading/);
    const expandTableButton = await within(budgetHeading).findByRole('button', {expanded: false});

    //expand budget table
    user.click(expandTableButton);

    const budgetTable = await screen.findByTestId(/budget-outer-table/);
    const expandRowButton = await within(budgetTable).findAllByTestId(
      /expand-budget-table-row-button/,
    );

    //expand expandable row button
    user.click(expandRowButton[0]);

    //table header in row table
    expect(await screen.findByTestId(/budget-inner-table/)).toBeDefined();
    expect(await screen.findByText(/FUEL TYPE/i)).toBeDefined();
    expect(await screen.findByText(/TOTAL OF FUEL PURCHASE/i)).toBeDefined();
    expect(await screen.findByText(/AMOUNT FUELLED/i)).toBeDefined();
    expect(await screen.findByText(/LITRES FUELLED/i)).toBeDefined();

    //1st data in row table
    expect(await screen.findByText(/PRIMAX 95/)).toBeDefined();
    expect(await screen.findByText(/51/)).toBeDefined();
    expect(await screen.findByText(/190.00/)).toBeDefined();
    expect(await screen.findByText(/150.80/)).toBeDefined();

    //2nd data in row table
    expect(await screen.findByText(/DIESEL/)).toBeDefined();
    expect(await screen.findByText(/22/)).toBeDefined();
    expect(await screen.findByText(/180.00/)).toBeDefined();
    expect(await screen.findByText(/31.00/)).toBeDefined();
    // close expandable row table
    user.click(expandRowButton[0]);

    //expand expandable row button for 13th data
    user.click(expandRowButton[12]);

    //table header in row table
    expect(await screen.findByTestId(/budget-inner-table/)).toBeDefined();
    expect(await screen.findByText(/FUEL TYPE/i)).toBeDefined();
    expect(await screen.findByText(/TOTAL OF FUEL PURCHASE/i)).toBeDefined();
    expect(await screen.findByText(/AMOUNT FUELLED/i)).toBeDefined();
    expect(await screen.findByText(/LITRES FUELLED/i)).toBeDefined();

    //1st data in row table
    expect(await screen.findByText(/DIESEL/)).toBeDefined();
    expect(await screen.findAllByText(/30.00/)).toBeDefined();
    expect(await screen.findAllByText(/3.30/)).toBeDefined();
    expect(await screen.findAllByText(/3/)).toBeDefined();
  });

  //open modal (Cancel button)
  it('It can open modal using custom statement button', async () => {
    renderWithConfig(<CustomerBudget userId={`d812d91d-fd8b-48d9-b889-25150c93c38f`} />);
    const budgetHeading = await screen.findByTestId(/budget-card-heading/);
    const expandTableButton = await within(budgetHeading).findByTestId(/custom-statement-button/);

    //expand budget table
    user.click(expandTableButton);

    expect(await screen.findByText(/Start date/)).toBeDefined();
    expect(await screen.findByText(/End date/)).toBeDefined();
    const cancelButton = await screen.findByTestId(/cancel-button/);

    expect(cancelButton).toBeDefined();
    user.click(cancelButton);
    expect(cancelButton).not.toBeVisible();
  });

  //open modal (Sent button)
  it('To make sure sent button is disable before input start date and end date', async () => {
    renderWithConfig(<CustomerBudget userId={`d812d91d-fd8b-48d9-b889-25150c93c38f`} />);
    const budgetHeading = await screen.findByTestId(/budget-card-heading/);
    const expandTableButton = await within(budgetHeading).findByTestId(/custom-statement-button/);

    //expand budget table
    user.click(expandTableButton);

    expect(await screen.findByText(/Start date/)).toBeDefined();
    expect(await screen.findByText(/End date/)).toBeDefined();

    const sentButton = await screen.findByTestId(/sent-button/);
    //make sure sent button are disabled before input date for start date and end date
    expect(sentButton).toBeDisabled;

    const startDateInput = (await screen.findByTestId(/start-date-input/)) as HTMLInputElement;
    const endDateInput = (await screen.findByTestId(/end-date-input/)) as HTMLInputElement;

    //make sure start and end date input is visible
    expect(startDateInput).toBeVisible();
    expect(endDateInput).toBeVisible();
  });
});
