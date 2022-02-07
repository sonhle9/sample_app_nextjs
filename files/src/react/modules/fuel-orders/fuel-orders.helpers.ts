import {FuelOrderStatus} from './fuel-orders.type';
import {BadgeProps} from '@setel/portal-ui';

export const getBadgeColorForStatus = (status?: string): BadgeProps['color'] => {
  switch (status) {
    case FuelOrderStatus.confirmed:
    case FuelOrderStatus.fuelReservePumpSuccess:
    case FuelOrderStatus.fuelFulfillmentSuccess:
    case FuelOrderStatus.canceled:
    case FuelOrderStatus.fulfilled:
      return 'success';
    case FuelOrderStatus.fuelReservePumpStarted:
    case FuelOrderStatus.fuelHoldAmountSuccess:
    case FuelOrderStatus.created:
    case FuelOrderStatus.fuelHoldAmountStarted:
    case FuelOrderStatus.fuelFulfillmentStarted:
    case FuelOrderStatus.fuelFulfillmentReady:
      return 'lemon';
    case FuelOrderStatus.error:
    case FuelOrderStatus.fuelFulfillmentError:
    case FuelOrderStatus.fuelFulfillmentReadyError:
    case FuelOrderStatus.fuelReservePumpError:
    case FuelOrderStatus.fuelHoldAmountError:
      return 'error';
    default:
      return 'grey';
  }
};
