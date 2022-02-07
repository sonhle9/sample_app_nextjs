import {screen, waitForElementToBeRemoved, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {InterfaceComponent} from './interface-component';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('InterfaceComponent', () => {
  it('works', async () => {
    renderWithConfig(<InterfaceComponent />);
    expect(await screen.findByText('Screen')).toBeVisible();

    user.click(screen.getByText('EDIT'));

    expect(within(screen.getByRole('dialog')).getByRole('textbox').textContent)
      .toMatchInlineSnapshot(`
      "{
        \\"screen\\": [
          \\"600px\\",
          \\"890px\\",
          \\"1200px\\"
        ]
      }"
    `);

    const $saveBtn = screen.getByText('SAVE');

    user.click($saveBtn);

    await waitForElementToBeRemoved($saveBtn);
  });
});
