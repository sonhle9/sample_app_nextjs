import {titleCase} from '@setel/portal-ui';
import {DevicesStatus} from 'src/app/devices/shared/enums';

export const deviceStatusOptions = Object.values(DevicesStatus).map((value) => ({
  value,
  label: titleCase(value),
}));
