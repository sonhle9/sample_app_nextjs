import * as React from 'react';
import setDate from 'date-fns/set';
import startOfDay from 'date-fns/startOfDay';
import {
  FieldContainer,
  FieldContainerProps,
  DaySelector,
  DaySelectorProps,
  TimeInput,
} from '@setel/portal-ui';

interface DateTimeFieldProps
  extends DaySelectorProps,
    Pick<FieldContainerProps, 'label' | 'layout' | 'labelAlign'> {}

export const DateTimeField = ({
  label,
  labelAlign,
  layout = 'horizontal-responsive',
  value: dateValue,
  onChangeValue,
  ...props
}: DateTimeFieldProps) => {
  return (
    <FieldContainer label={label} labelAlign={labelAlign} layout={layout}>
      <div className="flex items-center space-x-2">
        <DaySelector
          value={dateValue}
          onChangeValue={(newDay) => {
            const newValue = startOfDay(newDay);
            // keep existing time value
            onChangeValue(
              dateValue ? setDate(dateValue, extractDayInfo(newValue)) : newValue,
              null,
            );
          }}
          {...props}
        />
        <TimeInput
          hours={dateValue ? dateValue.getHours() : 0}
          minutes={dateValue ? dateValue.getMinutes() : 0}
          disabled={!dateValue}
          onChangeValue={(timeValue) => {
            if (dateValue) onChangeValue(setDate(dateValue, timeValue), null);
          }}
        />
      </div>
    </FieldContainer>
  );
};

function extractDayInfo(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
  };
}
