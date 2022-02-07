import {Button, Modal, ModalBody, ModalFooter} from '@setel/portal-ui';
import {Formik} from 'formik';
import React from 'react';
import {FormikRadioGroup} from 'src/react/components/formik';
import {STATION_STATUS_FRIENDLY_NAME} from '../stations.const';
import {useUpdateStationBasicDetails} from '../stations.queries';

interface EditStationStatusModalProps {
  isOpen: boolean;
  onDismiss: (boolean) => void;
  status: {
    fieldName: string;
    initialValue: Record<string, string | Record<string, string>>;
    label: string;
  };
  stationId: string;
}

export function EditStationStatusModal({
  isOpen,
  onDismiss: setEditStationStatusModal,
  status,
  stationId,
}: EditStationStatusModalProps) {
  const {mutate: updateStation, isLoading} = useUpdateStationBasicDetails(stationId);

  return (
    <Modal
      size="standard"
      header="Edit status"
      isOpen={isOpen}
      onDismiss={setEditStationStatusModal}>
      <Formik
        initialValues={status.initialValue}
        onSubmit={(values) => {
          updateStation(values, {
            onSuccess: () => {
              setEditStationStatusModal(false);
            },
          });
        }}>
        {(formikBag) => (
          <form onSubmit={formikBag.handleSubmit}>
            <ModalBody>
              <FormikRadioGroup
                fieldName={status.fieldName}
                label={status.label}
                options={Object.entries(STATION_STATUS_FRIENDLY_NAME).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </ModalBody>
            <ModalFooter className="text-right">
              <Button
                disabled={isLoading}
                onClick={setEditStationStatusModal}
                variant="outline"
                className="mr-3">
                CANCEL
              </Button>
              <Button disabled={isLoading} isLoading={isLoading} variant="primary" type="submit">
                SAVE CHANGES
              </Button>
            </ModalFooter>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
