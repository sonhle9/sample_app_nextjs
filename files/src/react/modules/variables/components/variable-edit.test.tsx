import * as React from 'react';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {renderWithConfig} from '../../../lib/test-helper';
import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import {VariableEdit} from './variable-edit';
import {generateMockVariable} from '../const';

const mock = generateMockVariable();

describe(`<VariableEdit />`, () => {
  it('saves', async () => {
    server.use(
      rest.get(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_, res, ctx) => {
          return res(ctx.json(mock));
        },
      ),
    );

    server.use(
      rest.put(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_, res, ctx) => {
          return res(ctx.json(mock));
        },
      ),
    );

    renderWithConfig(<VariableEdit id="test" variable={mock} />);

    user.click(screen.getByTestId('btn-edit'));
    expect(screen.queryByTestId('variable-editor')).toBeTruthy();
    user.type(screen.getByPlaceholderText('Enter variable name'), 'test');
    user.click(screen.getByTestId('btn-save'));
    user.click(screen.getByTestId('btn-confirm'));
    await waitForElementToBeRemoved(() => screen.getByTestId('variable-editor'));
  });
});
