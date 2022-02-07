import * as React from 'react';
import {Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader} from '@setel/portal-ui';
import {useFormikContext} from 'formik';

import {CustomerDetailsFieldset} from '../fieldsets/customer-details-fieldset';
import {ScoringCategoryFieldset} from '../fieldsets/scoring-category-fieldset';
import {ReasonFieldset} from '../fieldsets/reason-fieldset';

import {CountryOfResidentValue, IdentifierType} from '../../risk-profile.enum';

import {convertToOptions} from '../../../ledger/fee-settings/fee-settings.const';

type RiskProfileCreateModalProps = {
  onClose(): void;
  serverError: string;
  typeOfIdOptions: ReturnType<typeof convertToOptions>;
  customerTypeOptions: ReturnType<typeof convertToOptions>;
  nationalityOptions: ReturnType<typeof convertToOptions>;
  watchListOptions: ReturnType<typeof convertToOptions>;
  customerNatureOfBusinessOptions: ReturnType<typeof convertToOptions>;
  checkForOptions: ReturnType<typeof convertToOptions>;
  isCreating: boolean;
  handleSubmit: () => void;
};

export const RiskProfileCreateModal = ({
  onClose,
  serverError,
  typeOfIdOptions,
  customerNatureOfBusinessOptions,
  customerTypeOptions,
  nationalityOptions,
  watchListOptions,
  checkForOptions,
  isCreating,
  handleSubmit,
}: RiskProfileCreateModalProps) => {
  const {setFieldValue} = useFormikContext();
  const onTypeOfIdValueChange = (value: IdentifierType) => {
    let countryOfResident = CountryOfResidentValue.NonMalaysian;
    if ([IdentifierType.MyKad, IdentifierType.MyPr, IdentifierType.MyTentera].includes(value)) {
      countryOfResident = CountryOfResidentValue.Malaysian;
    }
    setFieldValue('typeOfId', value);
    setFieldValue('countryOfResident', countryOfResident);
  };

  return (
    <>
      <Modal
        isOpen
        onDismiss={onClose}
        aria-label="Create new risk profile"
        data-testid="risk-profile-modal">
        <div aria-label="Create new risk profile form">
          <ModalHeader>Create new risk profile</ModalHeader>
          <ModalBody className="space-y-4">
            {serverError && <Alert className="my-4" variant="error" description={serverError} />}
            <CustomerDetailsFieldset
              typeOfIdOptions={typeOfIdOptions}
              onTypeOfIdValueChange={onTypeOfIdValueChange}
            />
            <hr className="col-span-4" />
            <ScoringCategoryFieldset
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
                  isLoading={isCreating}
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
