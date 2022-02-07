import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getExperianRecordById,
  getLatestVerificationByCustomerId,
  getVerifications,
  getVerificationsDetails,
  getJumioAssessmentByVerificationId,
  overrideVerificationStatus,
  updateJumioAssessment,
} from 'src/react/services/api-verifications.service';
import {IGetJumioAssessmentByVerificationIdQueryParams} from 'src/react/services/api-verifications.type';
import {IJumioAssessmentUpdate} from '../../services/api-verifications.type';

export const useVerifications = (
  pagination: Omit<Parameters<typeof getVerifications>[0], 'from' | 'to'> & {
    range: [string, string];
  },
) => {
  const queryClient = useQueryClient();
  return useQuery(
    [CACHE_KEYS.Verifications, pagination],
    () => {
      const {
        range: [from, to],
        ...filter
      } = pagination;
      return getVerifications({...filter, from, to});
    },
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach((item) => {
            queryClient.setQueryData([CACHE_KEYS.VerificationsDetails, item.id], item);
          });
        }
      },
      keepPreviousData: true,
    },
  );
};

export const useVerificationsDetails = (id: string) => {
  return useQuery([CACHE_KEYS.VerificationsDetails, id], () => getVerificationsDetails(id));
};

export const useJumioAssessmentByVerificationId = (
  id: string,
  queryParams?: IGetJumioAssessmentByVerificationIdQueryParams,
) => {
  return useQuery(
    [CACHE_KEYS.JumioAssessment, id],
    () => id && getJumioAssessmentByVerificationId(id, queryParams),
  );
};

export const useExperianRecord = (id: string) => {
  return useQuery([CACHE_KEYS.ExperianRecords, id], () => getExperianRecordById(id));
};

export const useUpdateVerifications = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Parameters<typeof overrideVerificationStatus>[1]) =>
      overrideVerificationStatus(id, data),
    {
      onSuccess: (newParam) => {
        if (newParam) {
          queryClient.invalidateQueries([CACHE_KEYS.VerificationsDetails]);
          queryClient.setQueryData([CACHE_KEYS.VerificationsDetails, newParam.id], newParam);
        }
      },
    },
  );
};

export const useUpdateJumioAssessment = (identifier: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: IJumioAssessmentUpdate) => updateJumioAssessment(identifier, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.JumioAssessment]);
      },
    },
  );
};

export const useVerificationDetailByCustomerId = (customerId: string) =>
  useQuery([CACHE_KEYS.VerificationsDetailsByCustomer, customerId], () =>
    getLatestVerificationByCustomerId(customerId),
  );

const CACHE_KEYS = {
  Verifications: 'VERIFICATIONS',
  ExperianRecords: 'EXPERIAN_RECORDS',
  VerificationsDetails: 'VERIFICATIONS_DETAILS',
  VerificationsDetailsByCustomer: 'VERIFICATIONS_DETAILS_BY_CUSTOMER',
  JumioAssessment: 'JUMIO_ASSESSMENT',
};
