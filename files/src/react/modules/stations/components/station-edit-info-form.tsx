import {
  Button,
  DropdownSelectField,
  FieldContainer,
  ModalBody,
  ModalFooter,
  Radio,
  RadioGroup,
  TextField,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {IIndexStation, StationStatus} from 'src/shared/interfaces/station.interface';
import {statusOptions} from '../stations.const';
import {VendorTypes} from '../stations.enum';
import {useUpdateStationBasicDetails} from '../stations.queries';

export interface StationFormProps {
  current: IIndexStation;
  onDismiss: () => void;
}

export const StationEditInfoForm = (props: StationFormProps) => {
  const currentStation = props.current;
  const {mutate: update, isLoading} = useUpdateStationBasicDetails(currentStation.id);
  const [vendorType, setVendorType] = React.useState(currentStation.vendorType);
  const [status, setStatus] = React.useState(currentStation.status);
  const showMessage = useNotification();

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        update(
          {status, vendorType},
          {
            onSuccess: () => {
              showMessage({
                title: `${currentStation.id} updated.`,
              });
              props.onDismiss();
            },
          },
        );
      }}>
      <ModalBody>
        <TextField
          label="Station name"
          value={currentStation.name}
          readOnly
          layout="horizontal-responsive"
          className="w-56"
        />
        <TextField
          label="Station ID"
          value={currentStation.id}
          readOnly
          layout="horizontal-responsive"
          className="w-56"
        />
        <DropdownSelectField<string>
          label="Vendor type"
          value={vendorType}
          onChangeValue={setVendorType}
          options={vendorTypeOptions}
          className="w-56"
          layout="horizontal-responsive"
        />
        <FieldContainer label="Status" layout="horizontal-responsive" labelAlign="start">
          <RadioGroup
            name="status"
            value={status}
            onChangeValue={(val) => setStatus(val as StationStatus)}>
            {statusOptions.map((s) => (
              <Radio value={s.value} key={s.value}>
                {s.label}
              </Radio>
            ))}
          </RadioGroup>
        </FieldContainer>
      </ModalBody>
      <ModalFooter className="text-right space-x-3">
        <Button onClick={props.onDismiss} variant="outline">
          CANCEL
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading} data-testid="btn-save">
          SAVE
        </Button>
      </ModalFooter>
    </form>
  );
};

const vendorTypeOptions = Object.values(VendorTypes).map((value) => ({
  value,
  label: titleCase(value),
}));
