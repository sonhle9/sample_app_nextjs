import {screen} from '@testing-library/dom';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {GoalDetails} from './goal-details';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`Goal details`, () => {
  it('can render goal details page', async () => {
    renderWithConfig(<GoalDetails id="6093be1d43fefd00102b82b8" />);
    expect(await screen.findByText(/Refer a Friend - 1st Referral/)).toBeVisible();
    const fulfiledCriteria = await screen.findByText(/1 \/ 1/);
    //success badge
    expect(fulfiledCriteria.className.includes(`bg-success`)).toBe(true);
    expect(await screen.findByText(/Friend/)).toBeVisible();
    const relatedDocumentId = (await screen.findByRole('link', {
      name: /6b3e1f02-8135-4672-a2ec-ee8fc499c70c/,
    })) as HTMLAnchorElement;
    //mock data type= friend, direct to accounts page
    expect(relatedDocumentId.href.includes('/accounts/6b3e1f02-8135-4672-a2ec-ee8fc499c70c')).toBe(
      true,
    );
  });
});
