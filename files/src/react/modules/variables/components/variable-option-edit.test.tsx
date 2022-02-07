import * as React from 'react';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {IVariable} from '../types';
import {renderWithConfig} from '../../../lib/test-helper';
import {screen} from '@testing-library/react';
import {VariableOptionEdit} from './variable-option-edit';
import {VariableState, VariableType} from '../const';

describe(`<VariableOptionEdit />`, () => {
  it('cannot submit if nothing is changed', async () => {
    const mock: IVariable = {
      version: 1,
      isArchived: false,
      key: 'test',
      name: 'test',
      group: 'app',
      type: VariableType.Number,
      isToggled: true,
      createdBy: 'test',
      updatedBy: 'test',
      createdAt: 1572355719,
      updatedAt: 1603260224,
      state: VariableState.Created,
      variants: {test: {key: 'test', value: 0}},
    };

    server.use(
      rest.put(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_, res, ctx) => {
          return res(ctx.json(mock));
        },
      ),
    );

    renderWithConfig(
      <VariableOptionEdit variable={mock} variantKey="test">
        {(onTrigger) => <button onClick={() => onTrigger()} data-testid="btn-edit" />}
      </VariableOptionEdit>,
    );

    expect(screen.queryByTestId('editor')).toBeNull();
    user.click(screen.getByTestId('btn-edit'));
    expect(screen.queryByTestId('editor')).toBeTruthy();

    expect((screen.getByTestId('btn-save') as HTMLButtonElement).disabled).toBeTruthy();

    user.click(screen.getByText('Cancel'));
    user.click(screen.getByText('Leave'));
  });
});
