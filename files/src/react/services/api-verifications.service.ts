import {environment} from 'src/environments/environment';
import {
  Classification,
  IVerification,
  VerificationStatus,
  IJumioAssessment,
} from 'src/shared/interfaces/verifications.interface';
import {ajax, apiClient, fetchPaginatedData, getData, IPaginationParam} from '../lib/ajax';
import {
  IJumioAssessmentUpdate,
  IGetJumioAssessmentByVerificationIdQueryParams,
} from './api-verifications.type';

const BASE_URL = `${environment.verificationsApiBaseUrl}/api/verifications`;

export const getVerifications = (
  pagination: IPaginationParam & {
    verificationStatus: VerificationStatus;
    classification: Classification;
    from: string;
    to: string;
    searchKey?: string;
  },
) => fetchPaginatedData<IVerification>(`${BASE_URL}/verifications`, pagination);

export const getVerificationsDetails = (verificationId: string) =>
  getData<IVerification>(`${BASE_URL}/verifications/${verificationId}`);

export const getJumioAssessmentByVerificationId = (
  id: string,
  queryParams?: IGetJumioAssessmentByVerificationIdQueryParams,
) =>
  getData<IJumioAssessment>(`${BASE_URL}/jumio-assessments/${id}`, {
    params: queryParams,
  });

export const getExperianRecordById = (referenceId: string) =>
  getData<IVerification>(`${BASE_URL}/verifications/experian/${referenceId}`);

export const overrideVerificationStatus = (
  verificationId: string,
  data: {
    verificationStatus: VerificationStatus;
    updateRemarks: string;
  },
) =>
  apiClient
    .put<IVerification>(`${BASE_URL}/verifications/${verificationId}`, data)
    .then((res) => res.data);

export const uploadBlacklistCSV = (file: File) => {
  const formData = new FormData();
  formData.append('file', file, file.name);
  return apiClient
    .post<void>(`${BASE_URL}/blacklists/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);
};

export const updateJumioAssessment = (identifier: string, payload: IJumioAssessmentUpdate) =>
  apiClient
    .patch<void>(`${BASE_URL}/jumio-assessments/${identifier}`, payload)
    .then((res) => res.data);

export const getLatestVerificationByCustomerId = (customerId: string) =>
  ajax
    .get<{status: string; data: IVerification}>(
      `${BASE_URL}/verifications/customers/${customerId}/latest`,
    )
    .then((res) => res.data);
