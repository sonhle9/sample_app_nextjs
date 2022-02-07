import * as React from 'react';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {IVariable} from '../types';
import {renderWithConfig} from '../../../lib/test-helper';
import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import {VariableOptionDelete} from './variable-option-delete';
import {VariableState, VariableType} from '../const';

describe(`<VariableOptionDelete />`, () => {
  it('saves', async () => {
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
      <VariableOptionDelete variable={mock} variantKey="test">
        {(onTrigger) => <button onClick={() => onTrigger()} data-testid="btn-delete" />}
      </VariableOptionDelete>,
    );

    expect(screen.queryByTestId('dialog')).toBeNull();
    user.click(screen.getByTestId('btn-delete'));
    expect(screen.queryByTestId('dialog')).toBeTruthy();

    user.click(screen.getByTestId('btn-confirm'));
    await waitForElementToBeRemoved(() => screen.getByTestId('dialog'));
  });
});
