import {
  FulfilmentTypeEnum,
  StoreTriggerEnum,
  StoresStatusesEnum,
} from 'src/react/services/api-stores.type';

export const MIDNIGHT_MINUTES = 24 * 60 - 1;

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const STORE_FULFILMENT_LABELS: {[key in FulfilmentTypeEnum]: string} = {
  [FulfilmentTypeEnum.DELIVER_TO_VEHICLE]: 'Deliver to Vehicle',
};

export const STORE_TRIGGER_LABELS: {[key in StoreTriggerEnum]: string} = {
  [StoreTriggerEnum.APP_ORDERING_SHOP_ONLY]: 'Shop only',
  [StoreTriggerEnum.APP_ORDERING_SHOP_WHILE_FUELLING]: 'Shop while fuelling',
};

export const STORE_STATUS_LABELS: {[key in StoresStatusesEnum]: string} = {
  [StoresStatusesEnum.ACTIVE]: 'Active',
  [StoresStatusesEnum.INACTIVE]: 'Inactive',
  [StoresStatusesEnum.MAINTENANCE]: 'Maintenance',
  [StoresStatusesEnum.COMING_SOON]: 'Coming Soon',
};
