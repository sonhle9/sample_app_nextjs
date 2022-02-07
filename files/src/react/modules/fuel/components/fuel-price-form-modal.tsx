import * as React from 'react';
import {curry} from 'lodash';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Field,
  DateRangeSelector,
  Label,
  FieldStatus,
  MoneyInput,
  HelpText,
} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import {convertToCents, formatDate} from 'src/shared/helpers/common';
import {useCreateOrUpdateFuelPrice} from '../fuel-price.queries';
import {CreateOrUpdateFuelPriceRequest, FuelPriceResponse, IFuelType} from '../types';
import {formatFuelPrice} from '../../../lib/utils';

interface Statuses {
  [key: string]: FieldStatus;
}

interface IFormFields {
  primax95?: string;
  primax97?: string;
  diesel?: string;
  euro5?: string;
  dateRange?: string;
}

interface IProps {
  visible: boolean;
  onClose: () => void;
  data?: FuelPriceResponse;
  fuelNames: Record<IFuelType, string>;
}

interface IValidated {
  msgs: IFormFields;
  statuses: {
    [key: string]: FieldStatus;
  };
}

const initialFormValues = {
  primax95: '',
  primax97: '',
  diesel: '',
  euro5: '',
};

const initialHelpTextValues = {
  primax95: '',
  primax97: '',
  diesel: '',
  euro5: '',
  dateRange: '',
};

const initialStatusValues: Statuses = {
  primax95: undefined,
  primax97: undefined,
  diesel: undefined,
  euro5: undefined,
  dateRange: undefined,
};

export function FuelPriceFormModal(props: IProps) {
  const {mutate: createOrUpdateFuelPrice} = useCreateOrUpdateFuelPrice(props.data?._id);
  const [from, setFrom] = React.useState<Date>();
  const [to, setTo] = React.useState<Date>();
  const [formValues, setFormValues] = React.useState(initialFormValues);
  const [helpTexts, setHelpTexts] = React.useState<IFormFields>(initialHelpTextValues);
  const [statuses, setStatuses] = React.useState<Statuses>(initialStatusValues);
  const showMessage = useNotification();

  React.useEffect(() => {
    if (props.data) {
      populateData(props.data);
    }
  }, [props.data]);

  function populateData(data) {
    setFrom(new Date(data.startDate));
    setTo(new Date(data.endDate));
    setFormValues({
      primax95: formatFuelPrice(data.prices[0].price),
      primax97: formatFuelPrice(data.prices[1].price),
      diesel: formatFuelPrice(data.prices[2].price),
      euro5: formatFuelPrice(data.prices[3].price),
    });
  }

  function close() {
    if (!props.data) {
      setFrom(null);
      setTo(null);
      setFormValues(initialFormValues);
      setHelpTexts(initialHelpTextValues);
      setStatuses(initialStatusValues);
    }
    props.onClose();
  }

  function onSubmit() {
    if (!validateFieldValues()) {
      return;
    }

    createOrUpdateFuelPrice(buildPayload(), {
      onSuccess: () => {
        close();
        showMessage({
          variant: 'success',
          title: `Fuel price ${props.data ? 'updated' : 'created'} successfully!`,
        });
      },
      onError: () => {
        showMessage({
          variant: 'error',
          title: 'Something went wrong!',
        });
      },
    });
  }

  function buildPayload(): CreateOrUpdateFuelPriceRequest {
    return {
      startDate: formatDate(from),
      endDate: formatDate(to),
      prices: [
        {
          fuelType: IFuelType.PRIMAX_95,
          price: convertToCents(formValues.primax95),
        },
        {
          fuelType: IFuelType.PRIMAX_97,
          price: convertToCents(formValues.primax97),
        },
        {
          fuelType: IFuelType.DIESEL,
          price: convertToCents(formValues.diesel),
        },
        {
          fuelType: IFuelType.EURO5,
          price: convertToCents(formValues.euro5),
        },
      ],
    };
  }

  const handleInputChange = curry((fieldName: string, newValue: string) => {
    setFormValues({
      ...formValues,
      [fieldName]: newValue,
    });
  });

  function validateFieldValues(): boolean {
    const validated: IValidated = Object.entries(formValues).reduce(
      (acc, curr) => {
        const [field, value] = curr;
        const {msg, status} = validatePriceField(value);

        acc.msgs[field] = msg;
        acc.statuses[field] = status;
        return acc;
      },
      {msgs: {}, statuses: {}},
    );

    // Validate date range field
    if (!to || !from) {
      validated.statuses.dateRange = 'error';
      validated.msgs.dateRange = 'This field is required';
    }

    setHelpTexts(validated.msgs);
    setStatuses(validated.statuses);

    return !Object.entries(validated.statuses).some(([_, v]) => v === 'error');
  }

  function validatePriceField(value: string) {
    const match = /^\d\.\d{2}$/.test(value);
    let msg = '';
    let status: FieldStatus = 'success';

    if (!match) {
      msg = 'Please enter a valid price';
      status = 'error';
    }
    if (!value || value.length === 0) {
      msg = 'This field is required';
      status = 'error';
    }
    return {status, msg};
  }

  return (
    <>
      <Modal
        size="standard"
        isOpen={props.visible}
        onDismiss={close}
        aria-label={`${props.data ? 'Edit' : 'Create'} fuel price`}>
        <ModalHeader>{`${props.data ? 'Edit' : 'Create'} fuel price`}</ModalHeader>
        <ModalBody>
          <Field className="sm:grid sm:grid-cols-5 sm:items-start m-3" status={statuses.dateRange}>
            <Label className="pt-2 sm:col-span-1">Start & end Date</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-3">
              <DateRangeSelector
                from={from}
                to={to}
                onChangeValue={(newFrom, newTo) => {
                  setFrom(newFrom);
                  setTo(newTo);
                  setStatuses({
                    ...statuses,
                    dateRange: 'success',
                  });
                  setHelpTexts({
                    ...helpTexts,
                    dateRange: '',
                  });
                }}
                placeholder="Select date"
              />
              <HelpText>{helpTexts.dateRange}</HelpText>
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-5 sm:items-start m-3" status={statuses.primax95}>
            <Label className="pt-2 sm:col-span-1">{props.fuelNames?.PRIMAX_95}</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-1">
              <MoneyInput
                name="primax95"
                onChangeValue={handleInputChange('primax95')}
                value={formValues.primax95}
                placeholder="0.00"
              />
              <HelpText>{helpTexts.primax95}</HelpText>
            </div>
            <Label className="pt-2 ml-2">per litre</Label>
          </Field>
          <Field className="sm:grid sm:grid-cols-5 sm:items-start m-3" status={statuses.primax97}>
            <Label className="pt-2 sm:col-span-1">{props.fuelNames?.PRIMAX_97}</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-1">
              <MoneyInput
                name="primax97"
                onChangeValue={handleInputChange('primax97')}
                value={formValues.primax97}
                placeholder="0.00"
              />
              <HelpText>{helpTexts.primax97}</HelpText>
            </div>
            <Label className="pt-2 ml-2">per litre</Label>
          </Field>
          <Field className="sm:grid sm:grid-cols-5 sm:items-start m-3" status={statuses.diesel}>
            <Label className="pt-2 sm:col-span-1">{props.fuelNames?.DIESEL}</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-1">
              <MoneyInput
                name="diesel"
                onChangeValue={handleInputChange('diesel')}
                value={formValues.diesel}
                placeholder="0.00"
              />
              <HelpText>{helpTexts.diesel}</HelpText>
            </div>
            <Label className="pt-2 ml-2">per litre</Label>
          </Field>
          <Field className="sm:grid sm:grid-cols-5 sm:items-start m-3" status={statuses.euro5}>
            <Label className="pt-2 sm:col-span-1">{props.fuelNames?.EURO5}</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-1">
              <MoneyInput
                name="euro5"
                onChangeValue={handleInputChange('euro5')}
                value={formValues.euro5}
                placeholder="0.00"
              />
              <HelpText>{helpTexts.euro5}</HelpText>
            </div>
            <Label className="pt-2 ml-2">per litre</Label>
          </Field>
        </ModalBody>

        <ModalFooter>
          <div className="">
            <div className="flex items-center justify-end">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>
              <div style={{width: 12}} />
              <Button variant="primary" onClick={onSubmit}>
                {`SAVE ${props.data ? 'CHANGES' : ''}`}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}
