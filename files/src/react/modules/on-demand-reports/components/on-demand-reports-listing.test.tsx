import {screen, waitForElementToBeRemoved, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {OnDemandReportsListing} from './on-demand-reports-listing';

describe('<OnDemandReportsListing />', () => {
  it('renders the page', async () => {
    renderWithConfig(<OnDemandReportsListing />);

    await screen.findAllByTestId('on-demand-report-config-record');

    user.click(screen.getByText('CREATE'));

    const withinModal = within(screen.getByLabelText('Create a new reports config'));

    user.type(withinModal.getByLabelText('Report name'), 'Test Report');
    user.type(withinModal.getByLabelText('Report description'), 'Test Report description');
    user.type(withinModal.getByLabelText('URL'), 'test-report-integration');
    user.type(withinModal.getByLabelText('Report ID'), 'holistic-report-001');
    const $saveBtn = withinModal.getByText('SAVE');

    user.click($saveBtn);
    await waitForElementToBeRemoved($saveBtn);

    expect(screen.queryByLabelText('Create a new reports config')).toBeNull();
  });
});
