import * as React from 'react';
import {screen} from '@testing-library/react';
import user from '@testing-library/user-event';

import {renderWithConfig} from 'src/react/lib/test-helper';
import {MOCK_VERIFICATIONS} from 'src/react/services/mocks/api-verifications.service.mock';

import {VerificationsDetails} from './verifications-details';

describe(`<VerificationsDetails />`, () => {
  it('shows the details and verify', async () => {
    renderWithConfig(<VerificationsDetails id={MOCK_VERIFICATIONS[0].id} />);

    await screen.findAllByText('APPROVED');

    const $editBtn = await screen.findAllByText('EDIT');
    expect($editBtn).not.toBeNull();
    user.click($editBtn[0]);

    const $editModal = await screen.findByLabelText('Edit result');
    expect($editModal).not.toBeNull();
  });
});
