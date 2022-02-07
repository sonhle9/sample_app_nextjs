export enum StoreOrderTypeEnum {
  Mesra = 'mesra',
  Retail = 'retail',
  DineIn = 'dineIn',
  PickUp = 'pickUp',
}

export enum StoreOrderStatusesEnum {
  created = 'created',
  chargeSuccessful = 'successfulCharge',
  chargeError = 'errorCharge',
  voidSuccessful = 'successfulVoid',
  voidPending = 'pendingVoid',
  voidError = 'errorVoid',
  pointIssuanceSuccessful = 'successfulPointIssuance',
  pointIssuanceError = 'errorPointIssuance',
  pointVoidSuccessful = 'successfulPointVoid',
  pointVoidError = 'errorPointVoid',
  confirmed = 'confirmed',
  error = 'error',
}
