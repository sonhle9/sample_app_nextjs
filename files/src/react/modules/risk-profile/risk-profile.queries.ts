import {AxiosError} from 'axios';
import {useMutation, UseMutationOptions, useQuery, useQueryClient} from 'react-query';
import {
  getCustomerScorings,
  RiskScoringConfig,
  createRiskProfile,
  getRiskProfileDetails,
  updateRiskProfile,
  UpdateRiskProfile,
} from 'src/react/services/api-risk-profiles.service';

import {uploadBlacklistCSV} from 'src/react/services/api-verifications.service';

export const cacheKeys: {[key: string]: string} = {
  riskProfileList: 'risk_profiles_list',
  riskScoringsList: 'risk_scorings_list',
  riskProfilesDetails: 'risk_profiles_details',
  riskProfilesHistories: 'risk_profile_histories',
};

export const useGetListRiskScorings = (): {
  data: RiskScoringConfig[];
  isLoading: boolean;
} => {
  return useQuery([cacheKeys.riskScoringsList], () => getCustomerScorings(), {
    keepPreviousData: true,
  });
};

export const useCreateRiskProfile = () => {
  const queryClient = useQueryClient();
  return useMutation((data: Parameters<typeof createRiskProfile>[0]) => createRiskProfile(data), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([cacheKeys.riskProfileList]);
      }
    },
  });
};

export const useRiskProfileDetails = (riskProfileId: string) =>
  useQuery([cacheKeys.riskProfilesDetails, riskProfileId], () =>
    getRiskProfileDetails(riskProfileId),
  );

export const useUpdateRiskProfile = (riskProfileId: string) => {
  const queryClient = useQueryClient();
  return useMutation((data: UpdateRiskProfile) => updateRiskProfile(riskProfileId, data), {
    onSuccess: () => {
      queryClient.invalidateQueries([cacheKeys.riskProfileList]);
      queryClient.invalidateQueries([cacheKeys.riskProfilesDetails]);
      queryClient.invalidateQueries([cacheKeys.riskProfilesHistories]);
    },
  });
};

export function useBlacklistUpload(
  config?: UseMutationOptions<void, AxiosError<Error>, File, unknown>,
) {
  return useMutation(uploadBlacklistCSV, config);
}
