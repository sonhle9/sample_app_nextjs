import {Button, DropdownSelectField, Modal, TextField, titleCase} from '@setel/portal-ui';
import type {AxiosError} from 'axios';
import * as React from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useNotification} from 'src/react/hooks/use-notification';
import {VendorTypes} from '../stations.enum';
import {useAddStation} from '../stations.queries';

export interface AddStationFormProps {
  onDismiss: () => void;
}

export const StationAddForm = (props: AddStationFormProps) => {
  const {mutate: addStation, isLoading, error} = useAddStation();
  const [vendorType, setVendorType] = React.useState<VendorTypes | undefined>();
  const [stationId, setId] = React.useState('');
  const showMessage = useNotification();

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        if (stationId && vendorType) {
          addStation(
            {
              stationId,
              vendorType,
            },
            {
              onSuccess: () => {
                showMessage({
                  title: `${stationId} added.`,
                });
                props.onDismiss();
              },
            },
          );
        }
      }}>
      <Modal.Body>
        {error && (
          <QueryErrorAlert
            error={error as AxiosError}
            description="Fail to add station"
            className="mb-5"
          />
        )}
        <DropdownSelectField
          label="Vendor type"
          value={vendorType}
          onChangeValue={(v) => setVendorType(v as VendorTypes)}
          options={
            Object.values(VendorTypes).map((v) => ({
              value: v,
              label: titleCase(v),
            })) as any
          }
          placeholder="Select vendor type"
          layout="horizontal-responsive"
          className="w-56"
        />
        <TextField
          label="Vendor station ID"
          value={stationId}
          onChangeValue={setId}
          required
          layout="horizontal-responsive"
          className="w-56"
        />
      </Modal.Body>
      <Modal.Footer className="text-right space-x-3">
        <Button onClick={props.onDismiss} variant="outline">
          CANCEL
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          SAVE
        </Button>
      </Modal.Footer>
    </form>
  );
};
