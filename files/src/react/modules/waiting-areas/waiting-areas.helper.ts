import {WaitingAreaStatus} from './waiting-areas.types';

export function getWaitingAreaStatusColor(
  status: WaitingAreaStatus,
): 'turquoise' | 'grey' | 'info' {
  switch (status) {
    case WaitingAreaStatus.ON:
      return 'turquoise';
    case WaitingAreaStatus.OFF:
      return 'grey';
    default:
      return 'info';
  }
}
