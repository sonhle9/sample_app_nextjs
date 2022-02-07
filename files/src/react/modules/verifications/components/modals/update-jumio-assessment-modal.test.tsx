import React from 'react';
import {within, screen} from '@testing-library/react';

import {VerificationsUpdateJumioAssessmentModal} from './update-jumio-assessment-modal';
import {renderWithConfig} from '../../../../lib/test-helper';
import {IJumioAssessment} from '../../../../../shared/interfaces/verifications.interface';

describe('<VerificationsUpdateJumioAssessmentModal/>', () => {
  it('should render the modal', async () => {
    const jumioData = {
      id: '612da3253d11f20012e25f1f',
      result: 'NEGATIVE',
      documentAuthenticity: {
        classification: 'NEGATIVE',
      },
      biometricMatching: {
        classification: 'NOT_AVAILABLE',
      },
      others: {
        classification: 'NOT_AVAILABLE',
      },
      verificationId: '612da2cee08a8100140e4245',
    };

    renderWithConfig(
      <VerificationsUpdateJumioAssessmentModal
        onDismiss={() => {}}
        data={jumioData as IJumioAssessment}
      />,
    );

    const modal = within(screen.getByTestId('update-jumio-assessment-modal'));

    expect(await modal.findByText('MANUAL VERIFICATION')).toBeDefined();

    const documentAuthenticityField = within(modal.getByTestId('documentAuthenticityField'));
    const biometricMatchingField = within(modal.getByTestId('biometricMatchingField'));
    const othersField = within(modal.getByTestId('othersField'));

    expect(documentAuthenticityField).toBeDefined();
    expect(await documentAuthenticityField.findByText(/^negative$/i)).toBeDefined();
    expect(biometricMatchingField).toBeDefined();
    expect(await biometricMatchingField.findByText(/^not.available$/i)).toBeDefined();
    expect(othersField).toBeDefined();
    expect(await othersField.findByText(/^not.available$/i)).toBeDefined();
    expect(modal.getByTestId('update-jumio-assessment-remark-textarea')).toBeDefined();

    const documentRadioOptionLabel = documentAuthenticityField.getByText('True');
    const documentRadioField = documentRadioOptionLabel.parentNode
      .childNodes[0] as HTMLInputElement;
    expect(documentRadioField.disabled).toBeFalsy();
    const biometricOptionLabel = biometricMatchingField.getByText('True');
    const biometricRadioField = biometricOptionLabel.parentNode.childNodes[0] as HTMLInputElement;
    expect(biometricRadioField.disabled).toBeTruthy();
    const othersRadioOptionLabel = othersField.getByText('True');
    const othersRadioField = othersRadioOptionLabel.parentNode.childNodes[0] as HTMLInputElement;
    expect(othersRadioField.disabled).toBeTruthy();
  });
});
