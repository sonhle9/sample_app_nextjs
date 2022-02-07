export interface ICard {
  id: string;
  cardNumber: string;
  userId: string;
  type: string;
  status: string;
  vendorStatus: string;
  issuedBy: string;
  isPhysicalCard: boolean;
  isActive: boolean;
  isActivatedAt: Date;
  isFrozen: boolean;
  isFrozenAt: Date;
  freezeReason: string;
  isRemoved: boolean;
  isPointEarningEnabled: boolean;
  isPointRedemptionEnabled: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  name: string;
  email: string;
  phone: string;
  isInternal: boolean;
  preferredPetrolBrand: string;
}

export interface IIndexLoyaltyCard {
  card: ICard;
  user: IUser;
}

export interface ILoyaltyCard {
  isPhysicalCard: boolean;
  isActive: boolean;
  isFailedActivation: boolean;
  overriddenToFrozen: boolean;
  overriddenToTemporarilyFrozen: boolean;
  isRemoved: boolean;
  isPointEarningEnabled: boolean;
  isPointRedemptionEnabled: boolean;
  id: string;
  cardNumber: string;
  userId: string;
  type: string;
  status: string;
  issuedBy: string;
  vendorStatus: string;
  createdAt: Date;
  updatedAt: Date;
  isFrozenAt?: any;
  updatedBy: string;
  freezeReason?: any;
  vendorCardType: string;
  vendorCardTypeDescription: string;
  createdBy: string;
  isActivatedAt: Date;
  isFailedActivationAt?: any;
  isTemporarilyFrozenAt?: any;
  failedActivationReason?: any;
  pointRedeemableBalance: number;
  pointTotalBalance: number;
  provider?: string;
  redeemedPoints: number;
  pointsExpiryDates?: string;
}

export interface IAddress {
  street1: string;
  street2: string;
  street3: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface IVendorLoyaltyCard {
  cardNumber: string;
  sourceId: string;
  accountNumber: string;
  fullName: string;
  email: string;
  nationality: string;
  newIc: string;
  oldIc: string;
  passportNumber: string;
  gender: string;
  dateOfBirth?: any;
  address: IAddress;
  homeNumber: string;
  mobileNumber: string;
  officeNumber: string;
}

export interface IUpdateLoyaltyCardInput {
  overriddenToFrozen?: boolean;
  overriddenToTemporarilyFrozen?: boolean;
  freezeReason?: string;
}
