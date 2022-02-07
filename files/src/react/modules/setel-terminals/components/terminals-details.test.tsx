import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {cleanup, screen, within} from '@testing-library/react';
import {TerminalsDetails} from './terminals-details';
import user from '@testing-library/user-event';

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

describe('<TerminalsDetails />', () => {
  it('render correctly with enough data', async () => {
    renderWithConfig(<TerminalsDetails serialNum="PB1239871234" />);

    expect(await screen.findByText(/EDC - 10000109/)).toBeDefined();
    expect(await screen.findByText(/Christian Dior/)).toBeDefined();
    expect(await screen.findAllByText(/PB1239871234/)).toBeDefined();
    expect(await screen.findAllByText(/SUSPENDED/)).toBeDefined();
    expect(await screen.findAllByText(/10000109/)).toBeDefined();
    expect(await screen.findAllByText(/P2/)).toBeDefined();
    expect(await screen.findAllByText(/Sunmi/)).toBeDefined();
    expect(await screen.findAllByText(/EDC/)).toBeDefined();
    expect(await screen.findByTestId('btn-general-edit')).toBeDefined();
  });

  it('should open edit general terminal modal', async () => {
    renderWithConfig(<TerminalsDetails serialNum="PB1239871234" />);

    const editBtn = await screen.findByTestId('btn-general-edit');
    user.click(editBtn);

    const modal = await screen.findByTestId('edit-terminal-modal');
    expect(modal).toBeVisible();

    const modalScreen = within(modal);
    const remarksInput = await modalScreen.findByTestId('terminal-remarks');
    const reasonInput = await modalScreen.findByTestId('reason-input');

    user.type(remarksInput, 'updatedRemarks');
    user.type(reasonInput, 'updated reason');

    expect(screen.getByDisplayValue(/updatedRemarks/)).toBeDefined();
    expect(await screen.findAllByText(/updated reason/)).toBeDefined();

    user.click(modalScreen.getByText(/SAVE CHANGES/));

    expect(
      await screen.findByText(/Terminal details has been successfully updated./),
    ).toBeVisible();
  });
  it('should render terminal metrics data', async () => {
    renderWithConfig(<TerminalsDetails serialNum="PB1239871236" />);

    expect(await screen.findAllByText(/Android 10.0/)).toBeDefined();
    expect(await screen.findByText(/Terminal monitor/)).toBeDefined();
    expect(await screen.findByText(/PCI_PTS_PRODUCT_TYPE/)).toBeDefined();
    expect(await screen.findAllByText(/DEVELOPMENT/)).toBeDefined();
    expect(await screen.findAllByText(/78%/)).toBeDefined();
    expect(await screen.findAllByText(/15%/)).toBeDefined();
    expect(await screen.findAllByText(/30%/)).toBeDefined();
    expect(await screen.findAllByText(/PCI_PTS_VERSION/)).toBeDefined();
    // expect(await screen.findAllByText(/APP_VERSION/)).toBeDefined();
    expect(await screen.findAllByText(/IMEI90000/)).toBeDefined();
    expect(await screen.findAllByText(/1200px \* 800px/)).toBeDefined();
    expect(await screen.findAllByText(/PB1239871236/)).toBeDefined();
  });
  it('should render timeline for all status except New', async () => {
    renderWithConfig(<TerminalsDetails serialNum="PB1239871236" />);
    expect(await screen.findAllByText(/Activated/)).toBeDefined();
    expect(await screen.findAllByText(/Created/)).toBeDefined();
    expect(screen.queryAllByText(/New/)).toHaveLength(0);
  });
});
