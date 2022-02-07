import {retailRoles, transactionRole} from 'src/shared/helpers/roles.type';
import {useHasPermission} from '../../auth/HasPermission';

//user can read latest payment transactions card in Accounts > Dashboard
export const useCanReadPaymentTransactions = () => useHasPermission([transactionRole.view]);

//user can read latest order card in Accounts > Dashboard
export const useCanReadFuelOrder = () =>
  useHasPermission([retailRoles.fuelOrderView, retailRoles.fuelOrderRecoveryView]);
export const useCanReadStoreOrder = () => useHasPermission([retailRoles.storeOrderView]);
export const useCanReadStoreOrderInCarView = () =>
  useHasPermission([retailRoles.storeInCarOrderView]);
