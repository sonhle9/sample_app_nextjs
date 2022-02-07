import * as React from 'react';
import {Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader} from '@setel/portal-ui';
import {useFormikContext} from 'formik';

import {ScoringCategoryFieldset} from '../fieldsets/scoring-category-fieldset';
import {ReasonFieldset} from '../fieldsets/reason-fieldset';

import {convertToOptions} from '../../../ledger/fee-settings/fee-settings.const';

import {RiskProfileDetails} from '../../../../services/api-risk-profiles.service';

type RiskProfileUpdateModalProps = {
  riskProfileData: RiskProfileDetails;
  isLoading: boolean;
  onClose(): void;
  serverError: string;
  customerTypeOptions: ReturnType<typeof convertToOptions>;
  nationalityOptions: ReturnType<typeof convertToOptions>;
  watchListOptions: ReturnType<typeof convertToOptions>;
  customerNatureOfBusinessOptions: ReturnType<typeof convertToOptions>;
  checkForOptions: ReturnType<typeof convertToOptions>;
  isUpdating: boolean;
  handleSubmit: () => void;
};

export const RiskProfileUpdateModal = ({
  riskProfileData,
  isLoading,
  onClose,
  serverError,
  customerNatureOfBusinessOptions,
  customerTypeOptions,
  nationalityOptions,
  watchListOptions,
  checkForOptions,
  isUpdating,
  handleSubmit,
}: RiskProfileUpdateModalProps) => {
  const {setFieldValue} = useFormikContext();

  React.useEffect(() => {
    if (riskProfileData) {
      setFieldValue('customerType', riskProfileData.customerType.value);
      setFieldValue('countryOfResident', riskProfileData.countryOfResident.value);
      setFieldValue('nationality', riskProfileData.nationality?.value || '');
      setFieldValue('watchList', riskProfileData.watchList.value);
      setFieldValue('natureOfBusiness', riskProfileData.natureOfBusiness.value);
      setFieldValue('checkFor', riskProfileData.checkFor);
      setFieldValue('remarks', riskProfileData.remark || '');
    }
  }, []);

  return (
    <>
      <Modal
        isOpen
        onDismiss={onClose}
        aria-label="Edit risk scoring"
        data-testid="risk-profile-modal">
        <div aria-label="Edit risk scoring form">
          <ModalHeader>Edit risk scoring</ModalHeader>
          <ModalBody className="space-y-4">
            {serverError && <Alert className="my-4" variant="error" description={serverError} />}
            <ScoringCategoryFieldset
              isUpdate={true}
              customerTypeOptions={customerTypeOptions}
              nationalityOptions={nationalityOptions}
              watchListOptions={watchListOptions}
              customerNatureOfBusinessOptions={customerNatureOfBusinessOptions}
            />
            <hr className="col-span-4" />
            <ReasonFieldset checkForOptions={checkForOptions} />
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end">
              <div className="flex-grow text-right">
                <Button variant="outline" type="button" disabled={false} onClick={onClose}>
                  CANCEL
                </Button>
                <Button
                  data-testid="risk-profile-submit-btn"
                  variant="primary"
                  className="ml-3"
                  isLoading={isUpdating || isLoading}
                  onClick={handleSubmit}>
                  SAVE
                </Button>
              </div>
            </div>
          </ModalFooter>
        </div>
      </Modal>
    </>
  );
};
