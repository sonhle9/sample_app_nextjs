import {Button, Modal, ModalBody, ModalFooter, TextField} from '@setel/portal-ui';
import {Formik} from 'formik';
import React from 'react';
import {IReadStation} from '../../../../shared/interfaces/station.interface';
import {
  FormikDecimalInput,
  FormikDropdownField,
  FormikTextareaField,
  FormikTextField,
} from 'src/react/components/formik';
import {STATION_VENDOR_TYPES} from '../stations.const';
import {useUpdateStationBasicDetails} from '../stations.queries';

interface EditStationDetailsModalProps {
  isOpen: boolean;
  onDismiss: (boolean) => void;
  details: IReadStation;
}

export function EditStationDetailsModal({
  isOpen,
  onDismiss: setEditStationDetailsModal,
  details,
}: EditStationDetailsModalProps) {
  const {mutate: updateStation, isLoading} = useUpdateStationBasicDetails(details.id);

  const initialValues = {
    name: details.name,
    vendorType: details.vendorType,
    merchant: {
      tradingCompanyName: details.merchant.tradingCompanyName,
      gstNumber: details.merchant.gstNumber,
      phoneNumber: details.merchant.phoneNumber,
    },
    address: details.address,
    latitude: details.latitude,
    longitude: details.longitude,
    geofenceLatitude: details.geofenceLatitude,
    geofenceLongitude: details.geofenceLongitude,
    geofenceRadius: details.geofenceRadius,
    kiplerMerchantId: details.kiplerMerchantId,
    loyaltyVendorMerchantId: details.loyaltyVendorMerchantId,
    fuelMerchantId: details.fuelMerchantId,
    storeMerchantId: details.storeMerchantId,
  };

  return (
    <Modal
      size="standard"
      header="Edit details"
      overlayClassName="z-50"
      isOpen={isOpen}
      onDismiss={setEditStationDetailsModal}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          updateStation(
            {
              ...values,
              latitude: Number(values.latitude),
              longitude: Number(values.longitude),
              geofenceLatitude: Number(values.geofenceLatitude),
              geofenceLongitude: Number(values.geofenceLongitude),
              geofenceRadius: Number(values.geofenceRadius),
            },
            {
              onSuccess: () => {
                setEditStationDetailsModal(false);
              },
            },
          );
        }}>
        {({handleSubmit}) => (
          <>
            <ModalBody>
              <TextField
                label="Station ID"
                value={details.id}
                layout="horizontal-responsive"
                disabled
                className="w-80"
              />
              <FormikTextField
                label={
                  <>
                    Station name <sup className="text-red-600">*</sup>
                  </>
                }
                fieldName="name"
                layout="horizontal-responsive"
                className="w-80"
              />
              <FormikDropdownField
                className="w-60"
                label="Vendor type"
                fieldName="vendorType"
                layout="horizontal-responsive"
                options={Object.entries(STATION_VENDOR_TYPES).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
              <FormikTextField
                label={
                  <>
                    Trading company name <sup className="text-red-600">*</sup>
                  </>
                }
                fieldName="merchant.tradingCompanyName"
                layout="horizontal-responsive"
                className="w-60"
              />
              <FormikTextField
                label="GST number"
                fieldName="merchant.gstNumber"
                layout="horizontal-responsive"
                className="w-60"
              />
              <FormikTextareaField
                label="Address"
                fieldName="address"
                layout="horizontal-responsive"
              />
              <FormikDecimalInput
                label="Latitude"
                fieldName="latitude"
                layout="horizontal-responsive"
                allowNegative
                allowTrailingZero
                allowDecimalPlaces={true}
                decimalPlaces={6}
                data-testid="edit-latitude"
                className="w-60 text-left"
              />
              <FormikDecimalInput
                label="Longitude"
                fieldName="longitude"
                layout="horizontal-responsive"
                allowTrailingZero
                allowDecimalPlaces={true}
                decimalPlaces={6}
                className="w-60 text-left"
              />
              <FormikDecimalInput
                label="Geofence latitude"
                fieldName="geofenceLatitude"
                layout="horizontal-responsive"
                allowTrailingZero
                allowDecimalPlaces={true}
                decimalPlaces={6}
                className="w-60 text-left"
              />
              <FormikDecimalInput
                label="Geofence longitude"
                fieldName="geofenceLongitude"
                layout="horizontal-responsive"
                allowTrailingZero
                allowDecimalPlaces={true}
                decimalPlaces={6}
                className="w-60 text-left"
              />
              <FormikDecimalInput
                label="Geofence radius"
                fieldName="geofenceRadius"
                layout="horizontal-responsive"
                allowTrailingZero
                allowDecimalPlaces={true}
                decimalPlaces={6}
                className="w-60 text-left"
              />
              <FormikTextField
                label="Phone number"
                fieldName="merchant.phoneNumber"
                layout="horizontal-responsive"
                className="w-60"
              />
              <TextField
                label="Petrol pumps"
                value={details.pumps.length}
                layout="horizontal-responsive"
                disabled
                className="w-60"
              />
              <FormikTextField
                label="Merchant ID"
                fieldName="kiplerMerchantId"
                layout="horizontal-responsive"
                className="w-60"
              />
              <FormikTextField
                label="LMS Merchant ID"
                fieldName="loyaltyVendorMerchantId"
                layout="horizontal-responsive"
                className="w-60"
              />
              <FormikTextField
                label="Fuel merchant"
                fieldName="fuelMerchantId"
                layout="horizontal-responsive"
                className="w-9/12"
              />
              <FormikTextField
                label="Store merchant"
                fieldName="storeMerchantId"
                layout="horizontal-responsive"
                className="w-9/12"
              />
              <label>
                <sup className="text-red-600">* </sup>
                <sup className="text-gray-600">Required fields</sup>
              </label>
            </ModalBody>
            <ModalFooter className="text-right">
              <Button
                disabled={isLoading}
                onClick={setEditStationDetailsModal}
                variant="outline"
                className="mr-3">
                CANCEL
              </Button>
              <Button
                isLoading={isLoading}
                disabled={isLoading}
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
