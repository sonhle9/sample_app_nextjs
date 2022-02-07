import * as Yup from 'yup';

export const phoneRegex = /^\+60[0-9]{0,11}$/;
export const noPlusPhoneRegex = /^60[0-9]{0,11}$/;

export const SmartpayGeneralValidationSchema = Yup.object({
  applicationRef: Yup.string(),
  fleetPlan: Yup.string().trim().required('This field is required.'),
  smartpayCompanyId: Yup.string(),
  language: Yup.string(),
  website: Yup.string(),
  reason: Yup.string(),
  remark: Yup.string(),
  authorisedSignatory: Yup.string(),
});

export const SPAContactInfoValidationSchema = Yup.object({
  name: Yup.string().trim().required('This field is required.'),
  phoneNumber: Yup.string()
    .matches(noPlusPhoneRegex, 'This field must be a valid phone number.')
    .required('This field is required.'),
  emailAddress: Yup.string()
    .email('This field must be a valid email address.')
    .required('This field is required.'),
});

export const SPASubscriptionInfoValidationSchema = Yup.object({
  fleetPlan: Yup.string().trim().required('This field is required.'),
  language: Yup.string().trim().required('This field is required.'),
  isCreateVirtualAccount: Yup.boolean(),
});

export const SmartpayCompanyValidationSchema = Yup.object({
  companyOrIndividualName: Yup.string().trim().required('This field is required.'),
  companyType: Yup.string().trim().required('This field is required.'),
  companyEmbossName: Yup.string()
    .max(25, 'This field should be max 25 characters.')
    .matches(/^[a-z A-Z\d]+$/, 'No special character allowed here.')
    .trim()
    .required('This field is required.'),
  companyRegNo: Yup.string().trim().required('This field is required.'),
  companyRegDate: Yup.string().trim().required('This field is required.'),
  businessCategory: Yup.string().trim().required('This field is required.'),
});

export const SmartpayCreditAssessmentSchema = Yup.object({
  approvedCreditLimit: Yup.number(),
  requestedCreditLimit: Yup.number(),
  recommendedCreditLimit: Yup.number(),
  securityDepositRequired: Yup.boolean(),
  approvedSecurityDepositAmount: Yup.number(),
  requestedSecurityDepositAmount: Yup.number(),
  recommendedSecurityDepositAmount: Yup.number(),
  qualitativeRating: Yup.string(),
  quantitativeRating: Yup.string(),
  remarks: Yup.string(),
});

export const SmartpayBalanceTempoCreditLimitSchema = Yup.object({
  amount: Yup.number().required('This field is required.'),
  startDate: Yup.date().required('This field is required.'),
  endDate: Yup.date().required('This field is required.'),
});

export const SPPeriodOverrunSchema = Yup.object({
  periodStart: Yup.date().required('This field is required.'),
  periodEnd: Yup.date().required('This field is required.'),
  remarks: Yup.string().required('This field is required.'),
});
