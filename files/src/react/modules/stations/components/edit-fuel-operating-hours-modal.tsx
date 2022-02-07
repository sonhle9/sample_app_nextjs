import {Alert, Button, Modal, ModalBody, ModalFooter} from '@setel/portal-ui';
import {Formik} from 'formik';
import React from 'react';
import * as Yup from 'yup';
import {FormikFieldArray} from '../../../components/formik';
import {useUpdateStationBasicDetails} from '../stations.queries';
import {FormikFieldArrayOperatingHour} from './edit-station-operating-hours-modal';

interface EditFuelOperatingHoursModalProps {
  isOpen: boolean;
  onDismiss: (boolean) => void;
  fuelInCarOperatingHours: any;
  stationId: string;
}

const FUEL_OPERATING_HOURS_SCHEMA = Yup.object().shape({
  fuelInCarOperatingHours: Yup.array(
    Yup.object().shape({
      day: Yup.string().nullable(true).required('Invalid day'),
      timeSlots: Yup.array(
        Yup.object().shape({
          from: Yup.number().typeError('Invalid time').min(0).required("'From' time must be set"),
          to: Yup.number()
            .typeError('Invalid time')
            .min(0)
            .moreThan(Yup.ref('from'), "'To' time must be after 'From' time")
            .required("'To' time must be set"),
        }),
      ),
    }),
  ),
});

export function EditFuelOperatingHoursModal({
  isOpen,
  onDismiss: setEditFuelOperatingHoursModal,
  fuelInCarOperatingHours,
  stationId,
}: EditFuelOperatingHoursModalProps) {
  const {mutate: updateStation, isLoading} = useUpdateStationBasicDetails(stationId);

  return (
    <Modal
      size="standard"
      header="Edit fuel in-car operating hours"
      isOpen={isOpen}
      onDismiss={setEditFuelOperatingHoursModal}>
      <Formik
        validationSchema={FUEL_OPERATING_HOURS_SCHEMA}
        initialValues={{fuelInCarOperatingHours}}
        onSubmit={(values) => {
          updateStation(
            {fuelInCarOperatingHours: values.fuelInCarOperatingHours.sort((a, b) => a.day - b.day)},
            {
              onSuccess: () => {
                setEditFuelOperatingHoursModal(false);
              },
            },
          );
        }}>
        {({handleSubmit}) => (
          <>
            <ModalBody>
              <Alert
                className="mb-5"
                variant="info"
                description="The operating hours which has not been assigned to any day will be defaulted to no availabilty."
              />
              <FormikFieldArray
                label=""
                layout="vertical"
                addButtonText={() => 'Add day'}
                shouldShowAddButton={(items) => items.length < 7}
                arrayName="fuelInCarOperatingHours"
                newItemValue={{day: '', timeSlots: [{from: 0, to: 1440}]}}
                renderField={(props) => <FormikFieldArrayOperatingHour {...props} />}
              />
            </ModalBody>
            <ModalFooter className="text-right">
              <Button
                disabled={isLoading}
                onClick={setEditFuelOperatingHoursModal}
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
