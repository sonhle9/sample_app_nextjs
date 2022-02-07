import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from '../../../lib/test-helper';
import {WaitingAreaDetails} from './waiting-area-details';

describe(`<WaitingAreaDetails />`, () => {
  it('renders details', async () => {
    renderWithConfig(<WaitingAreaDetails id={'abc123'} />);

    expect(await screen.findByText(/name 123/)).toBeDefined();
    expect(await screen.findByText(/12312/)).toBeDefined();
    expect(await screen.findByText(/12412/)).toBeDefined();
    expect(await screen.findByText(/Petronas Stesyen Bestari/)).toBeDefined();
  });
});
