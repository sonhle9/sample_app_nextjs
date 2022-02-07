import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {TerminalListing} from './components/terminals-listing';
import {screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react';
import user from '@testing-library/user-event';

jest.setTimeout(100000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<TerminalListing />', () => {
  it('render correctly with enough data', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.getAllByTestId('terminal-row').length).toBe(50);
  });
  it('merchant filter should work', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    const merchantSearchBox = (
      await screen.findAllByPlaceholderText('Search by Merchant ID or Name')
    )[1];
    // search by merchant name
    user.type(merchantSearchBox, 'AutomationHNFFDWZNJI');
    user.click(await screen.findByText(/AutomationHNFFDWZNJI/, undefined, {timeout: 3000}));
    expect(document.activeElement).toBe(merchantSearchBox);
    expect(
      (await screen.findAllByText(/Merchant_Search_By_Name/, undefined, {timeout: 3000})).length,
    ).toBe(50);
    // search by merchant id
    user.clear(merchantSearchBox);
    await waitFor(() => expect((merchantSearchBox as HTMLInputElement).value).toBe(''));
    user.type(merchantSearchBox, '60236698fdc64c00179b20a0');
    user.click(await screen.findByText(/Christian Dior/, undefined, {timeout: 3000}));
    expect(
      (await screen.findAllByText(/Merchant_Search_By_ID/, undefined, {timeout: 3000})).length,
    ).toBe(50);
  });
  it('status filters should work', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    const statusFilterBox = (await screen.findAllByTestId('status-filter-box'))[1];
    // status = ACTIVE
    user.click(statusFilterBox);
    user.type(statusFilterBox, '{arrowdown}{enter}');
    expect((await screen.findAllByText(/00000001/, undefined, {timeout: 3000})).length).toBe(50);
    // status = NEW
    user.click(screen.getByText(/CLEAR ALL/));
    user.click(statusFilterBox);
    user.type(statusFilterBox, `${'{arrowdown}'.repeat(2)}{enter}`);
    expect((await screen.findAllByText(/00000003/, undefined, {timeout: 3000})).length).toBe(50);
    // status = SUSPENDED
    user.click(screen.getByText(/CLEAR ALL/));
    user.click(statusFilterBox);
    user.type(statusFilterBox, `${'{arrowdown}'.repeat(3)}{enter}`);
    expect((await screen.findAllByText(/00000002/, undefined, {timeout: 3000})).length).toBe(50);
  });
  it('type filter should work', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    const typeFilterBox = (await screen.findAllByTestId('type-filter-box'))[1];
    // type=EDC
    user.click(typeFilterBox);
    user.type(typeFilterBox, '{arrowdown}{enter}');
    expect((await screen.findAllByText(/00000001/, undefined, {timeout: 3000})).length).toBe(50);
    // type=IPT
    user.click(screen.getByText(/CLEAR ALL/));
    user.click(typeFilterBox);
    user.type(typeFilterBox, `${'{arrowdown}'.repeat(2)}{enter}`);
    expect((await screen.findAllByText(/00000002/, undefined, {timeout: 3000})).length).toBe(50);
    // type=EDC
    user.click(screen.getByText(/CLEAR ALL/));
    user.click(typeFilterBox);
    user.type(typeFilterBox, `${'{arrowdown}'.repeat(3)}{enter}`);
    expect((await screen.findAllByText(/00000003/, undefined, {timeout: 3000})).length).toBe(50);
  });
  it('successfully create a new terminal', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    // terminal modal must be visible
    user.click(await screen.findByText('CREATE'));
    const terminalModal = await screen.findByTestId('terminal-modal');
    expect(terminalModal).toBeVisible();
    const terminalModalScreen = within(terminalModal);
    // select merchants
    /*
     * since user event is asynchronous,
     * merchant search box could lose focus and reset value due to user event race condition.
     * The simplest solution is to move it to the top and use a waitFor guard to prevent other user interaction
     * until typing to merchant search box completes.
     */
    const merchantSearchBox = terminalModalScreen.getByPlaceholderText('Search merchant');
    user.type(merchantSearchBox, 'AutomationOCKUFUCKGJ');
    user.click(await screen.findByText(/AutomationOCKUFUCKGJ/, undefined, {timeout: 3000}));
    // enter terminal id
    const terminalIdInput = terminalModalScreen.getByPlaceholderText('Enter terminal ID');
    user.type(terminalIdInput, '12345678');
    await waitFor(() => expect((terminalIdInput as HTMLInputElement).value).toBe('12345678'));
    // pick type and status
    const terminalTypeInput = terminalModalScreen.getByTestId('terminal-type-input');
    user.click(terminalTypeInput);
    user.type(terminalTypeInput, '{arrowdown}{enter}');
    const terminalStatusInput = terminalModalScreen.getByTestId('terminal-status-input');
    user.click(terminalStatusInput);
    user.type(terminalStatusInput, '{arrowdown}{enter}');
    // pick date
    const terminalDeploymentDateInput = terminalModalScreen.getByPlaceholderText('Select date');
    user.type(terminalDeploymentDateInput, '{arrowright}');
    user.click(screen.getByText('15'));
    // input serial number, model
    user.type(terminalModalScreen.getByPlaceholderText('Enter serial number'), 'Test SR');
    user.type(terminalModalScreen.getByPlaceholderText('Enter model'), 'Test model');
    user.type(terminalModalScreen.getByLabelText('Remarks'), 'Some remarks');
    // click create
    user.click(terminalModalScreen.getByText(/SAVE/));
    // check the success notification
    expect(await screen.findByText(/Create terminal successfully/)).toBeVisible();
    expect(await screen.findByText(/12345678/)).toBeVisible();
  });
});
