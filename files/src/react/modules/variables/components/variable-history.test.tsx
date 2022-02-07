import {screen} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from '../../../lib/test-helper';
import {VariableHistory} from './variable-history';

describe(`<VariableHistory />`, () => {
  it('renders JSON viewer', async () => {
    renderWithConfig(<VariableHistory id="test" />);
    expect(await screen.findByTestId('row-0')).toBeDefined();

    expect(screen.queryByTestId('json-viewer')).toBeFalsy();
    user.click(screen.getByTestId('details-0'));
    expect(screen.queryByTestId('json-viewer')).toBeTruthy();
  });
});
