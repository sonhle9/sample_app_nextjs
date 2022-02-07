export enum CallbackCompletionStatusEnum {
  Pending = 'PENDING',
  DropOff = 'DROPOFF',
  Completed = 'COMPLETED',
}

export const VerificationStatusValues = ['PENDING', 'APPROVED', 'REJECTED'] as const;

export type VerificationStatus = typeof VerificationStatusValues[number];

export const ClassificationValues = [
  'TRUE_POSITIVE',
  'TRUE_NEGATIVE',
  'FALSE_POSITIVE',
  'FALSE_NEGATIVE',
] as const;

export type Classification = typeof ClassificationValues[number];

export type IdType = 'PASSPORT' | 'ID_CARD';

export interface IJumioNetverifyCallback {
  callBackType: string; // NETVERIFYID
  jumioIdScanReference: string; // Jumio’s reference number for each transaction
  verificationStatus: string;
  idScanStatus: string; // SUCCESS if verificationStatus = APPROVED_VERIFIED, otherwise ERROR
  idScanSource: string;
  idCheckDataPositions: string;
  idCheckDocumentValidation: string;
  idCheckHologram: string;
  idCheckMRZcode: string;
  idCheckMicroprint: string;
  idCheckSecurityFeatures: string;
  idCheckSignature: string;
  transactionDate: Date;
  callbackDate: Date;
  identityVerification?: unknown;
  idType?: IdType;
  idSubtype?: string;
  idCountry?: string;
  rejectReason?: unknown;
  idScanImage?: string;
  idScanImageFace?: string;
  idScanImageBackside?: string;
  idNumber?: string;
  idFirstName?: string;
  idLastName?: string;
  idDob?: string;
  idExpiry?: string;
  idUsState?: string;
  personalNumber?: string;
  idAddress?: unknown;
  merchantIdScanReference?: string;
  merchantReportingCriteria?: string;
  customerId?: string;
  clientIp?: string;
  firstAttemptDate?: string;
  optionalData1?: string;
  optionalData2?: string;
  dni?: string;
  curp?: string;
  gender?: string;
  presetCountry?: string;
  presetIdType?: string;
  dlCarPermission?: string;
  dlCategories?: unknown;
  nationality?: string;
  passportNumber?: string;
  durationOfStay?: string;
  numberOfEntries?: string;
  visaCategory?: string;
  originDob?: string;
  issuingAuthority?: string;
  issuingDate?: string;
  issuingPlace?: string;
  livenessImages?: string[];
  placeOfBirth?: string;
  facemap?: string;
  taxNumber?: string;
  cpf?: string;
  registrationNumber?: string;
  mothersName?: string;
  fathersName?: string;
  personalIdentificationNumber?: string;
  rgNumber?: string;
}

export interface IVerification {
  id: string;
  referenceId: string;
  customerId: string;
  callbackStatus: CallbackCompletionStatusEnum;
  verificationStatus: VerificationStatus;
  classification?: Classification;
  rejectReason?: string;
  verificationDate: string;
  callbackDate?: string;
  firstAttemptDate?: string;
  attemptNum?: number;
  idType?: IdType;
  passportExpiredAt?: string;
  idNumber?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  mobileNum?: string;
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  countryDisplayName?: string;
  address?: {
    country?: string;
    stateCode?: string;
    formattedAddress: string;
  };
  callbackObj?: IJumioNetverifyCallback;
  updateRemarks?: string;
  lastUpdatedByUser?: string;
  images?: {
    scan?: string;
    back?: string;
    face?: string;
  };
  livenessImages?: string[];
  occupation?: string;
  purposeOfTransaction?: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVerificationFilter {
  verificationStatus?: VerificationStatus;
  classification?: Classification;
  /**
   * min createdDate
   */
  from?: string;
  /**
   * max createdDate
   */
  to?: string;
  searchKey?: string;
}

export interface IVerificationRole {
  hasView: boolean;
  hasUpdate: boolean;
  hasDeviceView: boolean;
  hasDeviceUpdate: boolean;
}

export enum JumioClassificationEnum {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export interface IJumioAssessmentCriteria {
  classification: JumioClassificationEnum;
  assessment?: boolean;
}

export interface IJumioAssessment {
  id: string;
  verificationId: string;
  result: JumioClassificationEnum;
  documentAuthenticity: IJumioAssessmentCriteria;
  biometricMatching: IJumioAssessmentCriteria;
  others: IJumioAssessmentCriteria;
  remark?: string;
  overallClassification?: IJumioAssessmentCriteria;
  verifiedAt: Date;
  _embedded?: {
    verifiedBy?: {
      id: string;
      identifier: string;
    };
  };
}
