import {titleCase, BadgeProps} from '@setel/portal-ui';
import {PumpStatus, StationStatus, VendorStationStatus, VendorTypes} from './stations.enum';
import {addDays, format, startOfWeek} from 'date-fns';

export const statusOptions = Object.values(StationStatus).map((status) => ({
  value: status,
  label: titleCase(status, {hasWhitespace: true, hasDash: true}),
}));

export const statusLabelMap = statusOptions.reduce<Record<string, string>>(
  (result, option) => ({
    ...result,
    [option.value]: option.label,
  }),
  {},
);

export const StationStatusColor: Record<StationStatus, BadgeProps['color']> = {
  [StationStatus.ACTIVE]: 'success',
  [StationStatus.INACTIVE]: 'error',
  [StationStatus.MAINTENANCE]: 'lemon',
  [StationStatus.COMIN_SOON]: 'grey',
};

export const vendorStatusOptions = Object.values(VendorStationStatus).map((status) => ({
  value: status,
  label: titleCase(status),
}));

export const vendorStatusColor = {
  [VendorStationStatus.active]: 'success',
  [VendorStationStatus.inactive]: 'grey',
} as const;

export const PumpStatusColorMap = {
  [PumpStatus.ACTIVE]: 'success',
  [PumpStatus.INACTIVE]: 'grey',
  [PumpStatus.MAINTENANCE]: 'error',
  [PumpStatus.IMPORTED]: 'blue',
} as const;

export const STATION_STATUS_FRIENDLY_NAME = {
  [StationStatus.ACTIVE]: 'Active',
  [StationStatus.INACTIVE]: 'Inactive',
  [StationStatus.COMIN_SOON]: 'Coming soon',
  [StationStatus.MAINTENANCE]: 'Maintenance',
};

export const STATION_VENDOR_TYPES = {
  [VendorTypes.sapura]: 'Sapura',
  [VendorTypes.sentinel]: 'Sentinel',
  [VendorTypes.setel]: 'Setel',
};

const firstDOW = startOfWeek(new Date());
export const WEEKDAY_DROPDOWN_OPTIONS = Array.from(Array(7)).map((_, i) => ({
  value: i.toString(),
  label: format(addDays(firstDOW, i), 'EEEE'),
}));
