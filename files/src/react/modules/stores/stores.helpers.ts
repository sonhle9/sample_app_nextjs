import addDate from 'date-fns/add';
import _isPlainObject from 'lodash/isPlainObject';
import formatDate from 'date-fns/format';
import {
  StoresStatusesEnum,
  ITimeSlot,
  IFulfilment,
  FulfilmentStatusEnum,
  FulfilmentTypeEnum,
  StoreTypeOptions,
} from './stores.types';
import {retailRoles} from '../../../shared/helpers/roles.type';
import {useHasPermission} from '../auth/HasPermission';
import {
  IStore,
  IStoreTrigger,
  StoreTriggerEnum,
  ActivityTypeEnum,
  UserTypeEnum,
} from 'src/react/services/api-stores.type';
import {titleCase} from '@setel/portal-ui';

export function trimWhiteSpace(value: any) {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value.map(trimWhiteSpace);
  }
  if (_isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, trimWhiteSpace(val)]),
    );
  }
  return value;
}

export function getStoreStatusColor(
  status: StoresStatusesEnum,
): 'turquoise' | 'error' | 'grey' | 'warning' | 'info' {
  switch (status) {
    case StoresStatusesEnum.ACTIVE:
      return 'turquoise';
    case StoresStatusesEnum.INACTIVE:
      return 'error';
    case StoresStatusesEnum.COMING_SOON:
      return 'grey';
    case StoresStatusesEnum.MAINTENANCE:
      return 'warning';
    default:
      return 'info';
  }
}

export function getTimeLabel(slot: ITimeSlot) {
  if (is24Hours(slot)) {
    return '24 hours';
  }
  const fromDate = addDate(new Date(0, 0), {minutes: slot.from});
  const toDate = addDate(new Date(0, 0), {minutes: slot.to});
  return `${formatDate(fromDate, 'p')} - ${formatDate(toDate, 'p')}`;
}

export function is24Hours(slot: ITimeSlot) {
  const {from, to} = slot;
  return to - from >= 24 * 60 - 1;
}

export function toMinutes(time: {hours: number; minutes: number}) {
  return time.hours * 60 + time.minutes;
}

export function toHoursMinutes(minutes: number) {
  return {
    hours: minutes && Math.floor(minutes / 60),
    minutes: minutes && minutes % 60,
  };
}

export function fulfilmentsToStringArray(fulfilments: IFulfilment[] = []): string[] {
  return fulfilments
    ?.filter((fulfilment) => fulfilment.status === FulfilmentStatusEnum.ACTIVE)
    .map(({type}) => type);
}

export function stringArrayToFulfilments(strArray: string[] = []): IFulfilment[] {
  return Object.values(FulfilmentTypeEnum).map((type) => ({
    type,
    status: strArray.includes(type) ? FulfilmentStatusEnum.ACTIVE : FulfilmentStatusEnum.INACTIVE,
  }));
}

export function triggersToStringArray(triggers: IStoreTrigger[] = []): string[] {
  return triggers?.filter((trigger) => trigger.status === 'active').map(({event}) => event);
}

export function stringArrayToTriggers(
  strArray: string[] = [],
  originalValues: IStoreTrigger[],
): IStoreTrigger[] {
  return Object.values(StoreTriggerEnum).map((event) => ({
    event,
    status: strArray.includes(event) ? 'active' : 'inactive',
    catalogueSetId:
      originalValues?.find((trigger) => trigger.event === event)?.catalogueSetId || '',
  }));
}

export function toStoreTypeValue(value: string): IStore['isMesra'] {
  return value === StoreTypeOptions.Mesra;
}
export function toStoreTypeOption(value: IStore['isMesra']): StoreTypeOptions {
  return value ? StoreTypeOptions.Mesra : StoreTypeOptions.Other;
}

export function useUserCanCreateStore() {
  return useHasPermission([retailRoles.storeCreate]);
}

export function useUserCanUpdateStore() {
  return useHasPermission([retailRoles.storeUpdate]);
}

export function getActivityTypeOptions(): {value: string; label: string}[] {
  return [
    {
      value: '',
      label: 'All events',
    },
    ...Object.keys(ActivityTypeEnum).map((key) => ({
      value: ActivityTypeEnum[key],
      label: titleCase(ActivityTypeEnum[key], {hasUnderscore: true}),
    })),
  ];
}

export function getUserTypeOptions(): {value: string; label: string}[] {
  return [
    {
      value: '',
      label: 'All user types',
    },
    ...Object.keys(UserTypeEnum).map((key) => ({
      value: UserTypeEnum[key],
      label: titleCase(UserTypeEnum[key], {hasUnderscore: true}),
    })),
  ];
}
