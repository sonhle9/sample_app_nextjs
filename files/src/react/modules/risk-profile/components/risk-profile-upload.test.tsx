import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {renderWithConfig} from '../../../lib/test-helper';
import {BlacklistUpload} from './risk-profile-upload';
import user from '@testing-library/user-event';

describe(`<BlacklistUpload />`, () => {
  it('renders upload modal', async () => {
    renderWithConfig(<BlacklistUpload />);
    user.click(screen.getByText('IMPORT CSV'));

    const withinModal = within(screen.getByTestId('risk-profile-upload'));
    expect(await withinModal.findByText('IMPORT CSV')).toBeDefined();
  });
});
