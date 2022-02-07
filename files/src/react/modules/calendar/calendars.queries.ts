import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createCalendar,
  createHoliday,
  deleteCalendar,
  deleteHoliday,
  getPublicCalendarHolidays,
  getPublicCalendars,
  updateCalendar,
  updateHoliday,
} from 'src/react/services/api-calendars.service';

export const usePublicCalendarListing = (pagination: Parameters<typeof getPublicCalendars>[0]) => {
  const queryClient = useQueryClient();
  return useQuery([CACHE_KEYS.calendars, pagination], () => getPublicCalendars(pagination), {
    keepPreviousData: true,
    onSuccess: (data) => {
      if (data && data.items) {
        data.items.forEach((item) => {
          queryClient.setQueryData([CACHE_KEYS.calendars, item.id], item);
        });
      }
    },
  });
};

export const usePublicCalendarHolidays = (
  id: string,
  pagination: Parameters<typeof getPublicCalendarHolidays>[1],
) => {
  return useQuery([CACHE_KEYS.calendars, id], () => getPublicCalendarHolidays(id, pagination), {
    keepPreviousData: true,
  });
};

export const useCreateCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation((data: Parameters<typeof createCalendar>[0]) => createCalendar(data), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([CACHE_KEYS.calendars], {exact: true});
        queryClient.setQueryData([CACHE_KEYS.calendars, newParam.id], newParam);
      }
    },
  });
};

export const useUpdateCalendar = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation((data: Parameters<typeof createCalendar>[0]) => updateCalendar(id, data), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([CACHE_KEYS.calendars], {exact: true});
        queryClient.setQueryData([CACHE_KEYS.calendars, newParam.id], newParam);
      }
    },
  });
};

export const useRemoveCalendar = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteCalendar(id), {
    onSuccess: (removedCalendar) => {
      if (removedCalendar) {
        queryClient.invalidateQueries([CACHE_KEYS.calendars], {exact: true});
        queryClient.removeQueries([CACHE_KEYS.calendars, removedCalendar.id]);
      }
    },
  });
};

export const useCreateHoliday = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation((data: Parameters<typeof createHoliday>[1]) => createHoliday(id, data), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([CACHE_KEYS.calendars], {exact: true});
        queryClient.invalidateQueries([CACHE_KEYS.calendars, newParam.calendarId]);
      }
    },
  });
};

export const useUpdateHoliday = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation((data: Parameters<typeof updateHoliday>[1]) => updateHoliday(id, data), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([CACHE_KEYS.calendars], {exact: true});
        queryClient.invalidateQueries([CACHE_KEYS.calendars, newParam.calendarId]);
      }
    },
  });
};

export const useRemoveHoliday = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteHoliday(id), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([CACHE_KEYS.calendars], {exact: true});
        queryClient.invalidateQueries([CACHE_KEYS.calendars, newParam.calendarId]);
      }
    },
  });
};

const CACHE_KEYS = {
  calendars: 'CALENDARS_ADMIN',
};
