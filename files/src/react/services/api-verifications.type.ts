export enum EmbedQueryParamEnum {
  VerifiedBy = 'verifiedBy',
}

export interface IGetJumioAssessmentByVerificationIdQueryParams {
  embed?: EmbedQueryParamEnum[];
}

export interface IJumioAssessmentUpdate {
  documentAuthenticity: boolean;
  biometricMatching: boolean;
  others: boolean;
  remark: string;
}
