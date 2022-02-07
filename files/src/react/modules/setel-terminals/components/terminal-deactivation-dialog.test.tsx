import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {cleanup, screen} from '@testing-library/react';
import user from '@testing-library/user-event';

import TerminalDeactivationDialog from './terminal-deactivation-dialog';

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

describe('<TerminalDeactivationDialog />', () => {
  it('should render modal', async () => {
    const mockOnConfirm = jest.fn();
    const mockOnClose = jest.fn();

    renderWithConfig(
      <TerminalDeactivationDialog
        isVisible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.queryByTestId('terminal-deactivation-dialog')).toBeDefined();
    user.click(screen.getByText(/DEACTIVATE/));
    expect(mockOnConfirm).toHaveBeenCalled();

    user.click(screen.getByText(/CANCEL/));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
