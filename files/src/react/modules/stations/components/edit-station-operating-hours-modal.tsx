import {
  Alert,
  BareButton,
  Button,
  Field,
  FieldContainer,
  HelpText,
  Modal,
  ModalBody,
  ModalFooter,
  Radio,
  RadioGroup,
  TimeInput,
} from '@setel/portal-ui';
import * as Yup from 'yup';
import {Formik, FormikErrors, useField, useFormikContext} from 'formik';
import React from 'react';
import {
  FormikDropdownField,
  FormikFieldArray,
  FormikFieldArrayComponentProps,
  FormikRadioGroup,
} from '../../../components/formik';
import {WEEKDAY_DROPDOWN_OPTIONS} from '../stations.const';
import {intervalToDuration} from 'date-fns';
import {useUpdateStationBasicDetails} from '../stations.queries';

interface EditStationOperatingHoursModalProps {
  isOpen: boolean;
  onDismiss: (boolean) => void;
  isOperating24Hours: boolean;
  operatingHours: any;
  stationId: string;
}

const STATION_OPERATING_HOURS_SCHEMA = Yup.object().shape({
  isOperating24Hours: Yup.boolean(),
  operatingHours: Yup.array(
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

export function EditStationOperatingHoursModal({
  isOpen,
  onDismiss: setEditStationOperatingHoursModal,
  isOperating24Hours,
  operatingHours,
  stationId,
}: EditStationOperatingHoursModalProps) {
  const {mutate: updateStation, isLoading} = useUpdateStationBasicDetails(stationId);

  return (
    <Modal
      size="standard"
      header="Edit station operating hours"
      isOpen={isOpen}
      onDismiss={setEditStationOperatingHoursModal}>
      <Formik
        validationSchema={STATION_OPERATING_HOURS_SCHEMA}
        initialValues={{operatingHours, isOperating24Hours: isOperating24Hours.toString()}}
        onSubmit={(values) => {
          updateStation(
            {
              operatingHours: values.operatingHours.sort((a, b) => a.day - b.day),
              isOperating24Hours: values.isOperating24Hours === 'true',
            },
            {
              onSuccess: () => {
                setEditStationOperatingHoursModal(false);
              },
            },
          );
        }}>
        {({values, handleSubmit}) => (
          <>
            <ModalBody>
              <FormikRadioGroup
                fieldName="isOperating24Hours"
                label="Operating hours"
                options={[
                  {label: '24 hours - Everyday', value: 'true'},
                  {label: 'Custom', value: 'false'},
                ]}
              />
              {values.isOperating24Hours === 'false' && (
                <>
                  <Alert
                    className="mb-5"
                    variant="info"
                    description="The operating hours which has not been assigned to any day will be defaulted to no availabilty."
                  />
                  <FormikFieldArray
                    label=""
                    layout="vertical"
                    arrayName="operatingHours"
                    addButtonText={() => 'Add day'}
                    shouldShowAddButton={(items) => items.length < 7}
                    newItemValue={{day: '', timeSlots: [{from: 0, to: 1440}]}}
                    renderField={(props) => <FormikFieldArrayOperatingHour {...props} />}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter className="text-right">
              <Button
                disabled={isLoading}
                onClick={setEditStationOperatingHoursModal}
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

export function FormikFieldArrayOperatingHour({
  index,
  fieldName,
  remove,
  arrayName,
}: FormikFieldArrayComponentProps) {
  const {setFieldValue} = useFormikContext();
  const [, {value, touched, error}] = useField(fieldName);
  const [, {value: arrayNameValue}] = useField(arrayName);
  const [is24Hours, setIs24Hours] = React.useState(
    value.timeSlots[0] &&
      (value.timeSlots[0].from === 0 && value.timeSlots[0].to === 1440).toString(),
  );

  return (
    <Field
      data-testid="edit-operating-hour-day"
      className="flex justify-between border rounded-md p-4"
      status={touched && error ? 'error' : undefined}>
      <div className="flex-1">
        <FormikDropdownField
          label="Day"
          className="max-w-xs"
          fieldName={`${fieldName}.day`}
          options={[
            ...WEEKDAY_DROPDOWN_OPTIONS.filter(
              (weekDay) => !!!arrayNameValue.find((day) => day.day == weekDay.value),
            ),
            ...WEEKDAY_DROPDOWN_OPTIONS.filter((weekDay) => weekDay.value == value.day),
          ]}
          placeholder="Select day"
          postWrapValue={(val) => Number(val)}
          preWrapValue={(val) => val.toString()}
        />
        <FieldContainer label="Operating hours" layout="horizontal-responsive" labelAlign="start">
          <RadioGroup
            value={is24Hours}
            onChangeValue={(value) => {
              if (value === 'true') {
                setFieldValue(`${fieldName}.timeSlots`, []);
                setFieldValue(`${fieldName}.timeSlots.0`, {from: 0, to: 1440});
              }
              setIs24Hours(value);
            }}
            name={`${fieldName}.timeSlots`}>
            <Radio value="true">24 hours</Radio>
            <Radio wrapperClass="mb-4" value="false">
              Custom hours
            </Radio>
          </RadioGroup>
          {is24Hours === 'false' && (
            <FormikFieldArray
              label=""
              layout="vertical"
              arrayName={`${fieldName}.timeSlots`}
              newItemValue={{from: 0, to: 0}}
              renderField={(props) => <FormikFieldArrayOperatingHourTimeslots {...props} />}
              addButtonText={() => 'Add time'}
            />
          )}
        </FieldContainer>
      </div>
      <BareButton className="h-10 text-error-500" onClick={() => remove(index)}>
        REMOVE
      </BareButton>
    </Field>
  );
}

function FormikFieldArrayOperatingHourTimeslots({
  index,
  fieldName,
  remove,
}: FormikFieldArrayComponentProps) {
  const {setFieldValue} = useFormikContext();
  const [, {value, touched, error}] = useField(fieldName);

  const {hours: startHours, minutes: startMinutes} = intervalToDuration({
    start: 0,
    end: value.from * 60 * 1000,
  });
  const {hours: endHours, minutes: endMinutes} = intervalToDuration({
    start: 0,
    end: value.to * 60 * 1000,
  });
  const errors = error as FormikErrors<{from?: string; to?: string}>;

  return (
    <>
      <Field className="flex items-center" status={touched && error ? 'error' : undefined}>
        <TimeInput
          hours={startHours}
          minutes={startMinutes}
          onChangeValue={({hours, minutes}) =>
            setFieldValue(`${fieldName}.from`, hours * 60 + minutes)
          }
        />
        <span className="text-sm text-mediumgrey mx-3">to</span>
        <TimeInput
          hours={endHours}
          minutes={endMinutes}
          onChangeValue={({hours, minutes}) =>
            setFieldValue(`${fieldName}.to`, hours * 60 + minutes)
          }
        />
        {index > 0 && (
          <BareButton className="text-brand-500 ml-6 text-base" onClick={() => remove(index)}>
            —
          </BareButton>
        )}
      </Field>
      {(errors?.from || errors?.to) && (
        <HelpText className="text-error-500">
          {[errors.from, errors.to].filter(Boolean).join('; ')}
        </HelpText>
      )}
    </>
  );
}
