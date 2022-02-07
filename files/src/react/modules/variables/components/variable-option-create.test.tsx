import * as React from 'react';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {renderWithConfig} from '../../../lib/test-helper';
import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import {VariableOptionCreate} from './variable-option-create';
import {VariableType, generateMockVariable} from '../const';

describe(`<VariableOptionCreate />`, () => {
  it('renders', async () => {
    renderWithConfig(<VariableOptionCreate variable={generateMockVariable()} />);
    expect(screen.queryByTestId('editor')).toBeNull();
    user.click(screen.getByTestId('btn-create'));
    expect(screen.queryByTestId('editor')).toBeTruthy();

    user.click(screen.getByText('Cancel'));
    user.click(screen.getByText('Leave'));
  });

  it('saves for string', async () => {
    const mock = generateMockVariable({type: VariableType.String});
    server.use(
      rest.put(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_, res, ctx) => {
          return res(ctx.json(mock));
        },
      ),
    );

    renderWithConfig(<VariableOptionCreate variable={mock} />);

    user.click(screen.getByTestId('btn-create'));

    user.type(screen.getAllByPlaceholderText('Enter variable option name')[0], 'test');
    user.type(screen.getAllByPlaceholderText('Enter variable option value')[0], 'test');

    user.click(screen.getByTestId('btn-save'));
    user.click(screen.getByTestId('btn-confirm'));
    await waitForElementToBeRemoved(() => screen.getByTestId('editor'));
  });

  it('saves for number', async () => {
    const mock = generateMockVariable({type: VariableType.Number});
    server.use(
      rest.put(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_, res, ctx) => {
          return res(ctx.json(mock));
        },
      ),
    );

    renderWithConfig(<VariableOptionCreate variable={mock} />);

    user.click(screen.getByTestId('btn-create'));

    user.type(screen.getAllByPlaceholderText('Enter variable option name')[0], 'test');
    user.type(screen.getAllByPlaceholderText('Enter variable option value')[0], '0');

    user.click(screen.getByTestId('btn-save'));
    user.click(screen.getByTestId('btn-confirm'));
    await waitForElementToBeRemoved(() => screen.getByTestId('editor'));
  });

  it('saves for Boolean', async () => {
    const mock = generateMockVariable({type: VariableType.Boolean});
    server.use(
      rest.put(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_, res, ctx) => {
          return res(ctx.json(mock));
        },
      ),
    );

    renderWithConfig(<VariableOptionCreate variable={mock} />);

    user.click(screen.getByTestId('btn-create'));
    expect(
      (screen.getAllByPlaceholderText('Enter variable option value') as HTMLInputElement[]).map(
        ({value}) => value,
      ),
    ).toEqual(['True', 'False']);

    user.type(screen.getAllByPlaceholderText('Enter variable option name')[0], 'foo');
    user.type(screen.getAllByPlaceholderText('Enter variable option name')[1], 'bar');

    user.click(screen.getByTestId('btn-save'));
    user.click(screen.getByTestId('btn-confirm'));
    await waitForElementToBeRemoved(() => screen.getByTestId('editor'));
  });

  it('saves for JSON', async () => {
    const mock = generateMockVariable({type: VariableType.JSON});
    server.use(
      rest.put(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_, res, ctx) => {
          return res(ctx.json(mock));
        },
      ),
    );
    renderWithConfig(<VariableOptionCreate variable={mock} />);

    user.click(screen.getByTestId('btn-create'));
    user.type(screen.getAllByPlaceholderText('Enter variable option name')[0], 'test');
    user.type(screen.getAllByPlaceholderText('Enter variable option value')[0], '{{}');

    user.click(screen.getByTestId('btn-save'));
    user.click(screen.getByTestId('btn-confirm'));
    await waitForElementToBeRemoved(() => screen.getByTestId('editor'));
  });
});
