import {Button, DropdownSelect, Modal, ModalBody, ModalFooter} from '@setel/portal-ui';
import {FieldArray, Formik, useField, useFormikContext} from 'formik';
import React from 'react';
import {IPump} from '../../../../shared/interfaces/station.interface';
import {PumpStatus} from '../stations.enum';
import {useUpdateStationBasicDetails} from '../stations.queries';

interface EditPumpsStatusModalProps {
  isOpen: boolean;
  onDismiss: (boolean) => void;
  pumps: IPump[];
  stationId: string;
}

export function EditPumpsStatusModal({
  isOpen,
  onDismiss: setEditPumpsStatusModal,
  pumps,
  stationId,
}: EditPumpsStatusModalProps) {
  const {mutate: updateStation, isLoading} = useUpdateStationBasicDetails(stationId);

  return (
    <Modal
      size="large"
      header="Edit pump status"
      isOpen={isOpen}
      onDismiss={setEditPumpsStatusModal}>
      <Formik
        initialValues={{pumps}}
        onSubmit={(values) => {
          updateStation(values, {
            onSuccess: () => {
              setEditPumpsStatusModal(false);
            },
          });
        }}>
        {({handleSubmit}) => (
          <>
            <ModalBody className="grid grid-cols-6 gap-5" data-testid="edit-pump-status-rows">
              <FieldArray
                name="pumps"
                render={() => (
                  <>
                    {pumps.map((pump, index) => (
                      <FormikFieldArrayPumpStatus
                        key={pump.pumpId + index + 'edit-pumps'}
                        pump={pump}
                        index={index}
                      />
                    ))}
                  </>
                )}
              />
            </ModalBody>
            <ModalFooter className="text-right">
              <Button
                disabled={isLoading}
                onClick={setEditPumpsStatusModal}
                variant="outline"
                className="mr-3">
                CANCEL
              </Button>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                variant="primary"
                onClick={() => handleSubmit()}>
                SAVE CHANGES
              </Button>
            </ModalFooter>
          </>
        )}
      </Formik>
    </Modal>
  );
}

function FormikFieldArrayPumpStatus({index, pump}) {
  const {setFieldValue} = useFormikContext();
  const fieldName = `pumps.${index}.status`;
  const [, {value}] = useField(fieldName);

  return (
    <div className={'p-1 text-center border border-offwhite rounded-lg'}>
      <div className="py-3 text-xl text-mediumgrey font-medium">{pump.pumpId}</div>
      <DropdownSelect
        options={Object.values(PumpStatus).map((value) => ({
          value,
          label: value,
        }))}
        value={value}
        onChangeValue={(val) => setFieldValue(fieldName, val)}
        className="capitalize justify-center text-xs rounded-b-md rounded-t-none w-full"
        menuClass="text-left"
      />
    </div>
  );
}
