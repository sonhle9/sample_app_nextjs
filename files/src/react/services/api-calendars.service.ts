import {environment} from '../../environments/environment';
import {apiClient, IPaginationParam} from '../lib/ajax';
import axios from 'axios';
import {IPublicCalendar, IPublicHoliday} from '../modules/calendar/calendars.type';
const BASE_URL = `${environment.calendarsBaseUrl}/api/calendars`;

type Result<T> = void | {
  items: T;
  isEmpty: boolean;
  page: number;
  perPage: number;
  pageCount: number;
  total: number;
};

export const getPublicCalendars = (
  pagination: IPaginationParam & {searchKey: string},
): Promise<Result<IPublicCalendar[]>> => {
  const source = axios.CancelToken.source();

  const request = axios
    .get(`${BASE_URL}/public/calendars`, {
      params: {
        ...pagination,
      },
    })
    .then(({data, headers}) => {
      const items = data || [];
      return {
        items,
        isEmpty: items.length === 0,
        page: +headers['x-page'] || 0,
        perPage: +headers['x-per-page'] || 0,
        pageCount: +headers['x-pages-count'] || 0,
        total: +headers['x-total-count'] || 0,
      };
    })
    .catch((err) => {
      if (!axios.isCancel(err)) {
        throw err;
      }
    });

  (request as any).cancel = () => source.cancel();

  return request;
};

export const getPublicCalendarHolidays = (
  id: string,
  pagination: IPaginationParam,
): Promise<Result<IPublicHoliday[]>> => {
  const source = axios.CancelToken.source();

  const request = axios
    .get(`${BASE_URL}/public/calendars/${id}/holidays`, {
      params: {
        ...pagination,
      },
    })
    .then(({data, headers}) => {
      const items = data || [];
      return {
        items,
        isEmpty: items.length === 0,
        page: +headers['x-page'] || 0,
        perPage: +headers['x-per-page'] || 0,
        pageCount: +headers['x-pages-count'] || 0,
        total: +headers['x-total-count'] || 0,
      };
    })
    .catch((err) => {
      if (!axios.isCancel(err)) {
        throw err;
      }
    });

  (request as any).cancel = () => source.cancel();

  return request;
};

type CalendarData = Omit<IPublicCalendar, 'id' | 'createdAt' | 'updatedAt'>;
type HolidayData = Omit<
  IPublicHoliday,
  'id' | 'createdAt' | 'updatedAt' | 'dayNumber' | 'calendarId'
>;

export const createCalendar = (data: CalendarData) =>
  apiClient.post<IPublicCalendar>(`${BASE_URL}/admin/calendars`, data).then((res) => res.data);

export const updateCalendar = (id: string, data: CalendarData) =>
  apiClient.put<IPublicCalendar>(`${BASE_URL}/admin/calendars/${id}`, data).then((res) => res.data);

export const deleteCalendar = (id: string) =>
  apiClient.delete(`${BASE_URL}/admin/calendars/${id}`).then((res) => res.data);

export const createHoliday = (id: string, data: HolidayData) =>
  apiClient
    .post<IPublicHoliday>(`${BASE_URL}/admin/calendars/${id}/holidays`, data)
    .then((res) => res.data);

export const updateHoliday = (id: string, data: HolidayData) =>
  apiClient.put<IPublicHoliday>(`${BASE_URL}/admin/holidays/${id}`, data).then((res) => res.data);

export const deleteHoliday = (id: string) =>
  apiClient.delete(`${BASE_URL}/admin/holidays/${id}`).then((res) => res.data);
