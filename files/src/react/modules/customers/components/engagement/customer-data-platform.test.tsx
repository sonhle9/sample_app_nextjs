import {screen, within} from '@testing-library/dom';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {CustomerDataPlatform} from './customer-data-platform';
import user from '@testing-library/user-event';

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`Customer Data Platform Attributes`, () => {
  it("expand and display customer's attributes list", async () => {
    renderWithConfig(<CustomerDataPlatform userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    const attributesCardHeader = await screen.findByTestId(/customer-attributes-card-header/);
    const attributesExpandButton = await within(attributesCardHeader).findByRole('button', {
      expanded: false,
    });
    user.click(attributesExpandButton);

    expect(await screen.findByTestId(/customer-attributes-table-attribute-col/)).toBeVisible();
    expect(await screen.findByText(/teytestingemail@gmail.com/)).toBeDefined();
  });
});
