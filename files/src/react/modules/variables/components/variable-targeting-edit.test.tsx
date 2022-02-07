import * as React from 'react';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {IVariable} from '../types';
import {renderWithConfig} from '../../../lib/test-helper';
import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import {ConstraintOperator, VariableState, VariableType} from '../const';
import {VariableTargetingEdit} from './variable-targeting-edit';
import {generateMockTargetingOptions} from '../../../services/mocks/api-variables.service.mock';
import {waitFor} from '@testing-library/dom';

describe(`<VariableTargetingEdit />`, () => {
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
    onVariation: [{variantKey: 'foo', percent: 100}],
    offVariation: 'bar',
    variants: {foo: {key: 'foo', value: 0}, bar: {key: 'bar', value: 1}},
    targets: [
      {
        priority: 0,
        constraints: [{property: 'userId', operator: ConstraintOperator.In, value: {test: true}}],
        distributions: [{variantKey: 'foo', percent: 100}],
      },
    ],
  };

  const mockTargetingOptions = generateMockTargetingOptions();

  const operatorToValueTypeMock = mockTargetingOptions.operators.reduce((obj, op) => {
    obj[op.key] = op.valueType;
    return obj;
  }, {});

  it('cannot submit if nothing is changed', async () => {
    renderWithConfig(
      <VariableTargetingEdit
        variable={mock}
        targetingOptions={mockTargetingOptions}
        operatorsToValueTypeMap={operatorToValueTypeMock}
      />,
    );

    expect(screen.queryByTestId('editor')).toBeNull();
    user.click(screen.getByTestId('btn-edit'));
    expect(screen.queryByTestId('editor')).toBeTruthy();

    expect((screen.getByTestId('btn-save') as HTMLButtonElement).disabled).toBeTruthy();

    user.click(screen.getByText('Cancel'));
    user.click(screen.getByText('Leave'));
  });

  it('saves percentage rollout', async () => {
    server.use(
      rest.put(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_req, res, ctx) => {
          return res(ctx.json(mock));
        },
      ),
    );

    renderWithConfig(
      <VariableTargetingEdit
        variable={mock}
        targetingOptions={mockTargetingOptions}
        operatorsToValueTypeMap={operatorToValueTypeMock}
      />,
    );

    user.click(screen.getByTestId('btn-edit'));

    expect(screen.queryByTestId('percentage-rollout')).toBeNull();
    user.selectOptions(screen.getByTestId('input-onVariation'), 'multiple');
    await waitFor(() => expect(screen.queryByTestId('percentage-rollout')).toBeTruthy());

    user.type(screen.getByTestId('input-onVariation-0'), '50');
    user.type(screen.getByTestId('input-onVariation-1'), '50');

    await waitFor(() => screen.getByTestId('btn-save'));
    user.click(screen.getByTestId('btn-save'));
    user.click(screen.getByTestId('btn-confirm'));
    await waitForElementToBeRemoved(() => screen.getByTestId('editor'));
  });
});
