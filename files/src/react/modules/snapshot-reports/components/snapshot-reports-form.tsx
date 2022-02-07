import {
  Button,
  Checkbox,
  CheckboxGroup,
  createArray,
  DropdownSelect,
  FieldContainer,
  Fieldset,
  ModalBody,
  ModalFooter,
  TextareaField,
  TextField,
  TimeInput,
  titleCase,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import {
  SnapshotReportEveryPeriod,
  SnapshotReportScheduleType,
} from 'src/react/services/api-reports.enum';
import {ISnapshotReportConfig, SnapshotReportConfigData} from 'src/react/services/api-reports.type';
import {useCreateReportConfig, useUpdateReportConfig} from '../snapshot-reports.queries';

interface SnapshotReportsFormProps {
  onSuccess: (result: ISnapshotReportConfig) => void;
  onCancel: () => void;
  currentSnapshotReportConfig?: ISnapshotReportConfig;
}

export const SnapshotReportsForm = (props: SnapshotReportsFormProps) => {
  const initialValues = React.useMemo(
    () => getInitialValues(props.currentSnapshotReportConfig),
    [props.currentSnapshotReportConfig],
  );

  const {mutate: create, isLoading: isCreating} = useCreateReportConfig();
  const {mutate: update, isLoading: isUpdating} = useUpdateReportConfig(
    props.currentSnapshotReportConfig ? props.currentSnapshotReportConfig.id : null,
  );

  const isLoading = isCreating || isUpdating;

  const formik = useFormik({
    initialValues,
    onSubmit: (valuesToSubmit) => {
      const prefilterValue = valuesToSubmit.prefilter.trim();
      const prefilter = prefilterValue ? parseJson(prefilterValue) : {};

      if (prefilter) {
        const operation = props.currentSnapshotReportConfig ? update : create;
        operation(
          {
            ...valuesToSubmit,
            prefilter,
          },
          {
            onSuccess: props.onSuccess,
          },
        );
      }
    },
  });
  const values = formik.values;

  return (
    <form onSubmit={formik.handleSubmit}>
      <ModalBody>
        <Fieldset legend="GENERAL" className="border-b border-gray-200">
          <TextField
            required
            label="Report name"
            name="reportName"
            value={values.reportName}
            onChange={formik.handleChange}
            layout={fieldLayout}
          />
          <TextField
            label="Report id"
            required
            name="reportId"
            value={values.reportId}
            onChange={formik.handleChange}
            layout={fieldLayout}
          />
          <TextField
            label="Folder name"
            required
            name="folderName"
            value={values.folderName}
            onChange={formik.handleChange}
            layout={fieldLayout}
          />
          <TextField
            label="Filename pattern"
            required
            name="fileNamePattern"
            value={values.fileNamePattern}
            placeholder="my_export_{{$today}}.csv"
            onChange={formik.handleChange}
            layout={fieldLayout}
          />
          <TextareaField
            label="Prefilter"
            name="prefilter"
            value={values.prefilter}
            onChange={formik.handleChange}
            required
            layout={fieldLayout}
          />
        </Fieldset>
        <Fieldset legend="SCHEDULE" className="pt-5">
          <FieldContainer label="Type" layout={fieldLayout}>
            <DropdownSelect
              value={values.schedule.scheduleType}
              onChangeValue={(val) => formik.setFieldValue('schedule.scheduleType', val)}
              options={SCHEDULE_TYPES as any}
              className="w-48"
            />
          </FieldContainer>
          {values.schedule.scheduleType === SnapshotReportScheduleType.EVERY && (
            <FieldContainer label="Every" layout={fieldLayout}>
              <DropdownSelect
                value={values.schedule.everyPeriod}
                onChangeValue={(val) => formik.setFieldValue('schedule.everyPeriod', val)}
                options={EVERY_OPTIONS as any}
                className="w-48"
              />
            </FieldContainer>
          )}
          {values.schedule.scheduleType === SnapshotReportScheduleType.HOURLY && (
            <TextField
              label="At Minute"
              name="schedule.everyHourAtMinute"
              value={values.schedule.everyHourAtMinute}
              onChange={formik.handleChange}
              maxLength={2}
              helpText="Must be between 0 to 59"
              layout={fieldLayout}
              className="w-48"
            />
          )}
          {values.schedule.scheduleType === SnapshotReportScheduleType.DAILY && (
            <FieldContainer label="Everyday at time" layout={fieldLayout}>
              <TimeInput
                hours={values.schedule.everyDayAt.hours}
                minutes={values.schedule.everyDayAt.minutes}
                onChangeValue={(timeValue) => {
                  formik.setFieldValue('schedule.everyDayAt.hours', timeValue.hours);
                  formik.setFieldValue('schedule.everyDayAt.minutes', timeValue.minutes);
                }}
              />
            </FieldContainer>
          )}
          {values.schedule.scheduleType === SnapshotReportScheduleType.WEEKLY && (
            <>
              <FieldContainer label="On days" layout={fieldLayout}>
                <div className="flex items-center flex-wrap">
                  <CheckboxGroup
                    name="weekDay"
                    value={values.schedule.everyWeekAt.weekOfDay as any[]}
                    onChangeValue={(vals) =>
                      formik.setFieldValue('schedule.everyWeekAt.weekOfDay', vals)
                    }>
                    {WEEKDAYS.map((day) => (
                      <Checkbox
                        wrapperClass="w-28"
                        value={day.value as any}
                        label={day.label}
                        key={day.value}
                      />
                    ))}
                  </CheckboxGroup>
                </div>
              </FieldContainer>
              <FieldContainer label="At time" layout={fieldLayout}>
                <TimeInput
                  hours={values.schedule.everyWeekAt.hours}
                  minutes={values.schedule.everyWeekAt.minutes}
                  onChangeValue={(timeValue) => {
                    formik.setFieldValue('schedule.everyWeekAt.hours', timeValue.hours);
                    formik.setFieldValue('schedule.everyWeekAt.minutes', timeValue.minutes);
                  }}
                />
              </FieldContainer>
            </>
          )}
          {values.schedule.scheduleType === SnapshotReportScheduleType.MONTHLY && (
            <>
              <FieldContainer label="On day" layout={fieldLayout}>
                <DropdownSelect
                  value={values.schedule.everyMonthAt.dayOfMonth}
                  onChangeValue={(v) => formik.setFieldValue('schedule.everyMonthAt.dayOfMonth', v)}
                  options={DAY_OPTIONS}
                  className="w-48"
                />
              </FieldContainer>
              <FieldContainer label="At time" layout={fieldLayout}>
                <TimeInput
                  hours={values.schedule.everyMonthAt.hours}
                  minutes={values.schedule.everyMonthAt.minutes}
                  onChangeValue={(timeValue) => {
                    formik.setFieldValue('schedule.everyMonthAt.hours', timeValue.hours);
                    formik.setFieldValue('schedule.everyMonthAt.minutes', timeValue.minutes);
                  }}
                />
              </FieldContainer>
            </>
          )}
        </Fieldset>
      </ModalBody>
      <ModalFooter className="text-right space-x-2">
        <Button onClick={props.onCancel} variant="outline">
          CANCEL
        </Button>
        <Button isLoading={isLoading} type="submit" variant="primary">
          SAVE
        </Button>
      </ModalFooter>
    </form>
  );
};

const fieldLayout = 'horizontal-responsive';

interface ISnapshotReportConfigFormValues extends Omit<SnapshotReportConfigData, 'prefilter'> {
  prefilter: string;
  schedule: Required<SnapshotReportConfigData['schedule']>;
}

const getInitialValues = (current?: ISnapshotReportConfig): ISnapshotReportConfigFormValues => {
  if (!current) {
    return DEFAULT_VALUES;
  }

  const {
    schedule: {
      scheduleType,
      everyPeriod = DEFAULT_VALUES.schedule.everyPeriod,
      everyHourAtMinute = DEFAULT_VALUES.schedule.everyHourAtMinute,
      everyDayAt = DEFAULT_VALUES.schedule.everyDayAt,
      everyWeekAt = DEFAULT_VALUES.schedule.everyWeekAt,
      everyMonthAt = DEFAULT_VALUES.schedule.everyMonthAt,
    },
    prefilter = {},
    ...otherProps
  } = current;

  return {
    ...otherProps,
    prefilter: JSON.stringify(prefilter),
    schedule: {
      scheduleType,
      everyPeriod,
      everyHourAtMinute,
      everyDayAt,
      everyWeekAt,
      everyMonthAt,
    },
  };
};

const DEFAULT_VALUES: ISnapshotReportConfigFormValues = {
  reportId: '',
  reportName: '',
  folderName: '',
  fileNamePattern: '',
  prefilter: `{
}`,
  schedule: {
    scheduleType: SnapshotReportScheduleType.MONTHLY,
    everyPeriod: SnapshotReportEveryPeriod.TwelveHour,
    everyHourAtMinute: 0,
    everyDayAt: {
      hours: 0,
      minutes: 0,
    },
    everyWeekAt: {
      weekOfDay: [],
      hours: 0,
      minutes: 0,
    },
    everyMonthAt: {
      dayOfMonth: 0,
      hours: 0,
      minutes: 0,
    },
  },
};

const SCHEDULE_TYPES = Object.values(SnapshotReportScheduleType).map((value) => ({
  value,
  label: titleCase(value),
}));

const DAY_OPTIONS = createArray(31).map((_, i) => i + 1);

const EVERY_OPTIONS = [
  {
    value: SnapshotReportEveryPeriod.FifteenMin,
    label: '10 minutes',
  },
  {
    value: SnapshotReportEveryPeriod.FifteenMin,
    label: '15 minutes',
  },
  {
    value: SnapshotReportEveryPeriod.ThirtyMin,
    label: '30 minutes',
  },
  {
    value: SnapshotReportEveryPeriod.OneHour,
    label: '1 hour',
  },
  {
    value: SnapshotReportEveryPeriod.TwoHour,
    label: '2 hours',
  },
  {
    value: SnapshotReportEveryPeriod.ThreeHour,
    label: '3 hours',
  },
  {
    value: SnapshotReportEveryPeriod.SixHour,
    label: '6 hours',
  },
  {
    value: SnapshotReportEveryPeriod.TwelveHour,
    label: '12 hours',
  },
];

const WEEKDAYS = [
  {
    label: 'Sunday',
    value: 0,
  },
  {
    label: 'Monday',
    value: 1,
  },
  {
    label: 'Tuesday',
    value: 2,
  },
  {
    label: 'Wednesday',
    value: 3,
  },
  {
    label: 'Thursday',
    value: 4,
  },
  {
    label: 'Friday',
    value: 5,
  },
  {
    label: 'Saturday',
    value: 6,
  },
];

const parseJson = (jsonString: string) => {
  try {
    const result = JSON.parse(jsonString);
    return result;
  } catch (e) {
    return null;
  }
};
