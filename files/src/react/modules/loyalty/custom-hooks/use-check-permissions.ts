import {useHasPermission} from 'src/react/modules/auth/HasPermission';
import {loyaltyRoles, cardGroupRole} from 'src/shared/helpers/roles.type';

export const useCanEditMembers = () => useHasPermission([loyaltyRoles.editLoyaltyMembers]);

export const useCanEditPointExpiries = () => useHasPermission([loyaltyRoles.editPointExpiries]);

export const useCanEditLoyaltyCategories = () =>
  useHasPermission([loyaltyRoles.editLoyaltyCategories]);

export const useCanEditEarningRules = () => useHasPermission([loyaltyRoles.editEarningRules]);

export const useCanEditRedemptionRules = () => useHasPermission([loyaltyRoles.editRedemptionRules]);

export const useCanEditPointTransfers = () => useHasPermission([loyaltyRoles.editPointTransfer]);

export const useCanEditPointAdjustments = () =>
  useHasPermission([loyaltyRoles.editPointAdjustment]);

export const useCanListCardGroups = () => useHasPermission([cardGroupRole.serviceView]);

//user can read loyalty info card in Accounts > Dashboard
export const useCanReadLoyalty = () =>
  useHasPermission([loyaltyRoles.adminAccess, loyaltyRoles.viewLoyaltyCards]);
