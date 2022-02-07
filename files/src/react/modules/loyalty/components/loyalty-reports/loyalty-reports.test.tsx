import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyReports} from './loyalty-reports';

describe('<LoyaltyReports />', () => {
  it('renders accordingly', () => {
    renderWithConfig(<LoyaltyReports />);

    expect(screen.queryAllByTestId('report-card').length).toBe(7);
  });
});
