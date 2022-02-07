import * as React from 'react';
import user from '@testing-library/user-event';
import {Confirm} from './confirm';
import {renderWithConfig} from '../../../lib/test-helper';
import {screen} from '@testing-library/react';

describe(`<Confirm />`, () => {
  it('cancels', async () => {
    let confirmed = false;

    renderWithConfig(
      <Confirm
        header="test"
        caption="test"
        cancel="test"
        confirm="test"
        onConfirm={() => {
          confirmed = true;
        }}>
        {(onTrigger) => <button onClick={() => onTrigger()} data-testid="btn-trigger" />}
      </Confirm>,
    );

    user.click(screen.getByTestId('btn-trigger'));
    expect(screen.queryByTestId('dialog')).toBeDefined();
    user.click(screen.getByTestId('btn-cancel'));
    expect(screen.queryByTestId('dialog')).toBeNull();
    expect(confirmed).toBeFalsy();
  });

  it('confirms', async () => {
    let confirmed = false;

    renderWithConfig(
      <Confirm
        header="test"
        caption="test"
        cancel="test"
        confirm="test"
        onConfirm={() => {
          confirmed = true;
        }}>
        {(onTrigger) => <button onClick={() => onTrigger()} data-testid="btn-trigger" />}
      </Confirm>,
    );

    user.click(screen.getByTestId('btn-trigger'));
    expect(screen.queryByTestId('dialog')).toBeDefined();
    user.click(screen.getByTestId('btn-confirm'));
    expect(screen.queryByTestId('dialog')).toBeNull();
    expect(confirmed).toBeTruthy();
  });
});
