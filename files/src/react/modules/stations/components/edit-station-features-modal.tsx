import {Button, Modal, ModalBody, ModalFooter} from '@setel/portal-ui';
import {FieldArray, Formik} from 'formik';
import React from 'react';
import {
  IStationFeature,
  IStationFeatureType,
} from '../../../../shared/interfaces/station.interface';
import {FormikMultiSelectField} from '../../../components/formik';
import {useUpdateStationBasicDetails} from '../stations.queries';

interface EditStationFeaturesModalProps {
  isOpen: boolean;
  onDismiss: (boolean) => void;
  allStationFeatures: IStationFeatureType[];
  existingStationFeatures: IStationFeature[];
  stationId: string;
}

export function EditStationFeaturesModal({
  isOpen,
  onDismiss: setEditStationFeaturesModal,
  allStationFeatures,
  existingStationFeatures,
  stationId,
}: EditStationFeaturesModalProps) {
  const {mutate: updateStation, isLoading} = useUpdateStationBasicDetails(stationId);

  return (
    <Modal
      size="standard"
      header="Edit features"
      isOpen={isOpen}
      onDismiss={setEditStationFeaturesModal}>
      <Formik
        initialValues={{features: existingStationFeatures}}
        onSubmit={(values) => {
          updateStation(values, {
            onSuccess: () => {
              setEditStationFeaturesModal(false);
            },
          });
        }}>
        {({handleSubmit}) => (
          <>
            <ModalBody>
              <FieldArray
                name="features"
                render={() => (
                  <>
                    {existingStationFeatures.map((feature, index) => {
                      const allFeatures = allStationFeatures.find(
                        (type) => type.typeId === feature.typeId,
                      );

                      if (!allFeatures) return;

                      return (
                        <FormikMultiSelectField
                          key={feature.typeId}
                          allowSelectAll
                          label={allFeatures.name}
                          fieldName={`features.${index}.featureItems`}
                          options={allFeatures.features.map((type) => ({
                            value: type.id,
                            label: type.name,
                          }))}
                          layout="horizontal-responsive"
                        />
                      );
                    })}
                  </>
                )}
              />
            </ModalBody>
            <ModalFooter className="text-right">
              <Button
                disabled={isLoading}
                onClick={setEditStationFeaturesModal}
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
