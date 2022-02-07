import {HolidayTypes} from 'src/react/services/api-calendars.enum';

export interface IPublicCalendar {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface IPublicHoliday {
  calendarId: string;
  dayNumber: 0;
  isoDate: string;
  holidayType: HolidayTypes;
  holidayName: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
