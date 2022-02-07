import {screen} from '@testing-library/react';
import * as React from 'react';
import {VARIABLES} from 'src/react/services/mocks/api-variables.service.mock';
import {renderWithConfig} from '../../../lib/test-helper';
import {VariableDetails} from './variable-details';

describe('<VariableDetails />', () => {
  it('renders initial variable', async () => {
    renderWithConfig(<VariableDetails id={VARIABLES[0].key} />);

    expect(await screen.findByTestId('page')).toBeTruthy();
    expect(screen.getByTestId('no-variable-option')).toBeTruthy();
  });

  it('renders variable with options', async () => {
    renderWithConfig(<VariableDetails id={VARIABLES[1].key} />);

    expect(await screen.findByTestId('page')).toBeTruthy();
    expect(screen.getAllByTestId('variable-option').length).toEqual(2);
  });
});
