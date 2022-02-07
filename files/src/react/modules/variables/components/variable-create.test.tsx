import * as React from 'react';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {IVariable} from '../types';
import {renderWithConfig} from '../../../lib/test-helper';
import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import {VariableCreate} from './variable-create';
import {VariableState, VariableType} from '../const';

const mock: IVariable = {
  key: 'test',
  version: 1,
  isArchived: false,
  name: 'test',
  type: VariableType.Boolean,
  createdAt: 1572355719,
  updatedAt: 1603260224,
  group: 'app',
  isToggled: false,
  createdBy: 'test',
  updatedBy: 'test',
  state: VariableState.Created,
};

describe(`<VariableCreate />`, () => {
  it('saves', async () => {
    server.use(
      rest.get(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_, res, ctx) => {
          return res(ctx.status(404), ctx.json({}));
        },
      ),
    );

    server.use(
      rest.post(`${environment.variablesBaseUrl}/api/variables/admin/variables`, (_, res, ctx) => {
        return res(ctx.status(201), ctx.json(mock));
      }),
    );

    let success = false;

    renderWithConfig(<VariableCreate onSuccess={() => (success = true)} />);

    user.click(screen.getByTestId('btn-create'));
    expect(screen.queryByTestId('variable-editor')).toBeTruthy();
    user.selectOptions(screen.getByTestId('input-group'), 'app');
    user.type(screen.getByLabelText('Variable key'), 'test');
    user.type(screen.getByLabelText('Variable name'), 'test');
    user.selectOptions(screen.getByTestId('input-type'), 'json');
    user.click(screen.getByTestId('btn-save'));
    user.click(screen.getByTestId('btn-confirm'));
    await waitForElementToBeRemoved(screen.queryByTestId('variable-editor'), {timeout: 5000});

    expect(success).toBeTruthy();
  });
});
