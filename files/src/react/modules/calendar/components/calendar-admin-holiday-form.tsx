import {
  Button,
  DaySelector,
  DropdownSelect,
  FieldContainer,
  formatDate,
  ModalBody,
  ModalFooter,
  TextField,
} from '@setel/portal-ui';
import * as React from 'react';
import {HolidayTypes} from 'src/react/services/api-calendars.enum';
import {useCreateHoliday, useUpdateHoliday} from '../calendars.queries';
import {IPublicHoliday} from '../calendars.type';

export interface ICalendarAdminFormProps {
  calendarId?: string;
  holidayData?: IPublicHoliday;
  onSuccess: (result: IPublicHoliday) => void;
  onCancel: () => void;
}

export const CalendarAdminHolidayForm = ({
  calendarId,
  holidayData,
  onSuccess,
  onCancel,
}: ICalendarAdminFormProps) => {
  const {mutate: create, isLoading: isCreating} = useCreateHoliday(calendarId);
  const {mutate: update, isLoading: isUpdating} = useUpdateHoliday(
    holidayData ? holidayData.id : '',
  );
  const [holidayName, setHolidayName] = React.useState(holidayData ? holidayData.holidayName : '');
  const [holidayType, setHolidayType] = React.useState(
    holidayData ? holidayData.holidayType : TYPE_OPTIONS[0].value,
  );
  const [isoDate, setIsoDate] = React.useState(holidayData ? new Date(holidayData.isoDate) : null);

  const isLoading = isCreating || isUpdating;
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        const operation = holidayData ? update : create;

        operation(
          {
            holidayName,
            holidayType,
            isoDate: formatDate(isoDate, {format: 'yyyy-MM-dd'}),
          },
          {onSuccess: onSuccess},
        );
      }}>
      <ModalBody>
        <TextField
          label="Holiday name"
          value={holidayName}
          onChangeValue={setHolidayName}
          layout="horizontal-responsive"
          className="sm:w-60"
          required
        />
        <FieldContainer label="Holiday type" layout="horizontal-responsive">
          <DropdownSelect
            value={holidayType as any}
            onChangeValue={setHolidayType}
            options={TYPE_OPTIONS}
            placeholder="Select type"
            className="sm:w-60"
          />
        </FieldContainer>
        <FieldContainer label="Date" layout="horizontal-responsive">
          <DaySelector
            value={isoDate}
            onChangeValue={(val) => {
              setIsoDate(val);
            }}
            placeholder="Select date"
          />
        </FieldContainer>
      </ModalBody>
      <ModalFooter className="text-right space-x-2">
        <Button onClick={onCancel} variant="outline">
          CANCEL
        </Button>
        <Button isLoading={isLoading} type="submit" variant="primary">
          SAVE
        </Button>
      </ModalFooter>
    </form>
  );
};

const TYPES = Object.values(HolidayTypes);

const TYPE_OPTIONS = [
  {
    value: TYPES[0],
    label: 'Regional Holiday',
  },
  {
    value: TYPES[1],
    label: 'National Holiday',
  },
  {
    value: TYPES[2],
    label: 'Weekend',
  },
];
