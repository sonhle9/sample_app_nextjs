import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeading,
  Checkbox,
  EditIcon,
  Field,
  FieldContainer,
  HelpText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PlusIcon,
  Skeleton,
  Text,
  TimeInput,
  TrashIcon,
} from '@setel/portal-ui';
import {FormikErrors, useFormik} from 'formik';
import classNames from 'classnames';
import {OPERATING_HOURS_SCHEMA} from '../stores.schema';
import {useStore, useUpdateStore} from '../stores.queries';
import {DAYS_OF_WEEK, MIDNIGHT_MINUTES} from '../stores.const';
import {IOperatingHours, ITimeSlot, StoresStatusesEnum} from '../stores.types';
import {
  getTimeLabel,
  is24Hours,
  toMinutes,
  toHoursMinutes,
  useUserCanUpdateStore,
} from '../stores.helpers';
import {TextBtn} from '../../../components/text-btn';

const DAY_ARRAY = [1, 2, 3, 4, 5, 6, 0];

function StoreOperatingHoursSlot(props: {
  timeSlot: ITimeSlot;
  slotIndex: number;
  errors: FormikErrors<ITimeSlot>;
  children?: React.ReactNode;
  onChange: (slot: ITimeSlot, slotIndex: number) => void;
  onRemove: (slot: ITimeSlot, slotIndex: number) => void;
}) {
  const {timeSlot, errors, slotIndex, children, onChange, onRemove} = props;
  const {hours: fromHour, minutes: fromMin} = toHoursMinutes(timeSlot.from);
  const {hours: toHour, minutes: toMin} = toHoursMinutes(timeSlot.to);
  const invalid = errors?.from || errors?.to;

  const onChangeFrom = (time: {hours: number; minutes: number}) =>
    onChange({from: toMinutes(time), to: timeSlot.to}, slotIndex);

  const onChangeTo = (time: {hours: number; minutes: number}) =>
    onChange({from: timeSlot.from, to: toMinutes(time)}, slotIndex);

  return (
    <div className="mb-2.5">
      <div className="flex items-center">
        <Field status={errors?.from ? 'error' : undefined}>
          <TimeInput
            hours={fromHour}
            minutes={fromMin}
            onChangeValue={onChangeFrom}
            data-testid="slot-from-time"
          />
        </Field>
        <div className="text-mediumgrey px-4"> to </div>
        <Field status={errors?.to ? 'error' : undefined}>
          <TimeInput
            hours={toHour}
            minutes={toMin}
            onChangeValue={onChangeTo}
            data-testid="slot-to-time"
          />
        </Field>
        <TextBtn
          className="ml-4 text-error-800 text-lg"
          onClick={() => onRemove(timeSlot, slotIndex)}>
          <TrashIcon />
        </TextBtn>
        <div className="flex-grow"></div>
        {children}
      </div>
      {invalid && (
        <HelpText className="text-error-500">
          {[errors.from, errors.to].filter(Boolean).join('; ')}
        </HelpText>
      )}
    </div>
  );
}

function StoreOperatingHoursDay(props: {
  operatingHours: IOperatingHours;
  isModified: boolean;
  errors: FormikErrors<IOperatingHours>;
  onChangeValue: (newValue: IOperatingHours) => void;
  onApplyAll: (newValue: IOperatingHours) => void;
}) {
  const {operatingHours, errors, onChangeValue} = props;
  const {day, timeSlots = []} = operatingHours;
  const show24Hours = timeSlots.length === 0;

  const onChangeSlot = (changedSlot: ITimeSlot, slotIndex: number) => {
    onChangeValue({
      day,
      timeSlots: timeSlots.map((slot, index) => (index === slotIndex ? changedSlot : slot)),
    });
  };

  const onRemoveSlot = (slot: ITimeSlot) => {
    onChangeValue({day, timeSlots: timeSlots.filter((item) => item !== slot)});
  };

  const onOpen24Hours = () => {
    onChangeValue({day, timeSlots: [{from: 0, to: MIDNIGHT_MINUTES}]});
  };

  const onAddSlot = () => {
    onChangeValue({
      day,
      timeSlots: [...timeSlots, {from: undefined, to: undefined}],
    });
  };

  const onApplyAll = () => props.onApplyAll(props.operatingHours);

  return (
    <FieldContainer
      layout="horizontal"
      label={DAYS_OF_WEEK[day]}
      labelAlign="start"
      className={classNames({'mb-3 pb-5 border-b': day})}>
      {timeSlots.map((timeSlot, slotIndex) => (
        <StoreOperatingHoursSlot
          key={slotIndex}
          slotIndex={slotIndex}
          timeSlot={timeSlot}
          errors={errors?.timeSlots?.[slotIndex] as FormikErrors<ITimeSlot>}
          onChange={onChangeSlot}
          onRemove={onRemoveSlot}>
          {slotIndex === 0 && props.isModified && (
            <TextBtn onClick={onApplyAll}>APPLY TO ALL</TextBtn>
          )}
        </StoreOperatingHoursSlot>
      ))}
      <div className="flex mt-2.5">
        <TextBtn className="mr-4" onClick={onAddSlot}>
          + ADD SLOT
        </TextBtn>
        {show24Hours && <TextBtn onClick={onOpen24Hours}>+ OPEN 24 HOURS</TextBtn>}
      </div>
    </FieldContainer>
  );
}

function StoreOperatingHoursModal(props: {
  storeId: string;
  currentStatus: StoresStatusesEnum;
  initialOperatingHours: IOperatingHours[];
  onDismiss: () => void;
  onSuccess: () => void;
}) {
  const {storeId, currentStatus, initialOperatingHours, onDismiss, onSuccess} = props;
  const [isModified, setModified] = React.useState({});

  const {mutate: updateStore, isLoading} = useUpdateStore(storeId, {
    onSuccess: () => {
      onDismiss();
      onSuccess();
    },
  });

  const formik = useFormik<IOperatingHours[]>({
    initialValues: DAY_ARRAY.map((day) => ({
      day,
      timeSlots: initialOperatingHours?.find((operatingHour) => operatingHour.day === day)
        ?.timeSlots,
    })),
    validationSchema: OPERATING_HOURS_SCHEMA,
    onSubmit: (values: IOperatingHours[]) => {
      const operatingHours = values.filter(({timeSlots}) => timeSlots?.length);
      updateStore({
        operatingHours,
        status: initialOperatingHours.length ? currentStatus : StoresStatusesEnum.ACTIVE,
      });
    },
  });

  const check24Hours =
    formik.values.length === 7 &&
    formik.values.every((day) => !!day?.timeSlots?.length && is24Hours(day?.timeSlots?.[0]));

  const disableSave =
    isLoading ||
    !formik.isValid ||
    formik.values.filter(({timeSlots}) => timeSlots?.length).length === 0;

  const onCheck24Hours = (checked: boolean) => {
    if (checked) {
      formik.setValues(
        DAY_ARRAY.map((day) => ({
          day,
          timeSlots: [{from: 0, to: 24 * 60 - 1}],
        })),
      );
    } else if (check24Hours) {
      formik.setValues(
        DAY_ARRAY.map((day) => ({
          day,
          timeSlots: [],
        })),
      );
    }
    setModified({});
  };

  const onChangeHours = (newValue: IOperatingHours) => {
    formik.setValues((currentValue) =>
      currentValue.map((value) => (value.day === newValue.day ? newValue : value)),
    );
    setModified((currentValue) => ({...currentValue, [newValue.day]: true}));
  };

  const onApplyAll = (newValue: IOperatingHours) => {
    formik.setValues((currentValue) =>
      currentValue.map((value) => ({...value, timeSlots: newValue.timeSlots})),
    );
    setModified({});
  };

  return (
    <>
      <Modal isOpen={true} onDismiss={props.onDismiss} aria-label="Operating hours">
        <ModalHeader>Operating hours</ModalHeader>
        <ModalBody>
          <div className="border-b pt-4 pb-8 mb-5">
            <Checkbox
              onChangeValue={onCheck24Hours}
              checked={check24Hours}
              label="Open 24 hours · Everyday"
            />
          </div>
          {formik.values.map((item, dayIndex) => (
            <StoreOperatingHoursDay
              key={item.day}
              errors={formik?.errors?.[dayIndex]}
              isModified={isModified[item.day]}
              operatingHours={item}
              onChangeValue={onChangeHours}
              onApplyAll={onApplyAll}
            />
          ))}
        </ModalBody>
        <ModalFooter className="flex justify-end space-x-4">
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={props.onDismiss}
            data-testid="btn-cancel">
            CANCEL
          </Button>
          <Button
            disabled={disableSave}
            isLoading={isLoading}
            variant="primary"
            onClick={formik.submitForm}
            data-testid="btn-save">
            SAVE CHANGES
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export function StoreOperatingHours(props: {storeId: string}) {
  const {data: store, isLoading, refetch} = useStore(props.storeId);
  const [isOpen, setOpen] = React.useState(false);

  const dayList = DAY_ARRAY.map((dayIndex) => ({
    label: DAYS_OF_WEEK[dayIndex],
    timeSlots: store?.operatingHours
      ?.find((hour) => hour.day === dayIndex)
      ?.timeSlots?.map((slot) => getTimeLabel(slot)) || ['-'],
  }));

  const hasOperatingHours = !!store?.operatingHours?.length;
  const isEveryday = dayList.every((day) => {
    return day?.timeSlots?.every(
      (slot, index) => slot !== '-' && slot === dayList?.[0].timeSlots[index],
    );
  });

  const canEdit = useUserCanUpdateStore();

  return (
    <Card className="mb-8">
      <CardHeading title="Operating hours">
        {canEdit && hasOperatingHours && (
          <Button
            variant="outline"
            minWidth="small"
            disabled={isLoading}
            leftIcon={<EditIcon />}
            onClick={() => setOpen(true)}>
            EDIT
          </Button>
        )}
      </CardHeading>
      <CardContent>
        {isLoading &&
          dayList.map(({label}, dayIndex) => (
            <FieldContainer
              key={label}
              layout="horizontal"
              label={label}
              labelAlign="start"
              className={classNames({'border-b pb-4 mb-4': dayIndex < dayList.length - 1})}>
              <Skeleton className="pt-2.5" width="full" height="medium" />
            </FieldContainer>
          ))}
        {!isLoading && !hasOperatingHours && (
          <div className="h-32 w-full flex flex-col items-center justify-center text-lightgrey">
            <Text className="mb-5">You have not added operating hours yet</Text>
            {canEdit && (
              <Button variant="outline" leftIcon={<PlusIcon />} onClick={() => setOpen(true)}>
                ADD HOURS
              </Button>
            )}
          </div>
        )}
        {!isLoading && hasOperatingHours && isEveryday && (
          <FieldContainer layout="horizontal" label="Everyday" labelAlign="start">
            <div className="pt-2.5">
              {dayList?.[0]?.timeSlots?.map((slot, index) => (
                <Text key={index}>{slot}</Text>
              ))}
            </div>
          </FieldContainer>
        )}
        {!isLoading &&
          hasOperatingHours &&
          !isEveryday &&
          dayList.map(({label, timeSlots}, dayIndex) => (
            <FieldContainer
              key={label}
              layout="horizontal"
              label={label}
              labelAlign="start"
              className={classNames({'border-b pb-4 mb-4': dayIndex < dayList.length - 1})}>
              <div className="pt-2.5">
                {timeSlots?.map((slot, slotIndex) => (
                  <Text key={slotIndex}>{slot}</Text>
                ))}
              </div>
            </FieldContainer>
          ))}
      </CardContent>
      {isOpen && (
        <StoreOperatingHoursModal
          storeId={props.storeId}
          currentStatus={store?.status}
          initialOperatingHours={store?.operatingHours}
          onDismiss={() => setOpen(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Card>
  );
}
