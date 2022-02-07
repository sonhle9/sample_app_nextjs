import {useMutation, useQuery, useQueryClient, UseQueryOptions} from 'react-query';
import {
  FraudProfile,
  getFraudProfile,
  updateFraudProfile,
  UpdateFraudProfileInput,
  FraudProfilesRestrictionType,
  FraudProfilesStatus,
  createFraudProfile,
  FraudProfilesTargetType,
  FraudProfilesInput,
} from 'src/react/services/api-blacklist.service';

export const fraudProfileQueryKeys = {
  listFraudProfile: 'listFraudProfile',
  fraudProfileDetails: 'fraudProfileDetails',
};

export const useFraudProfileDetails = (
  id: string,
  options?: UseQueryOptions<FraudProfile, unknown>,
) => {
  return useQuery(
    [fraudProfileQueryKeys.fraudProfileDetails, id],
    () => getFraudProfile(id),
    options,
  );
};

export interface CreateFraudProfileMutationInput {
  targetId: string;
  targetName: string;
  targetType: FraudProfilesTargetType;
  status: FraudProfilesStatus;
  restrictions: Array<FraudProfilesRestrictionType>;
  remarks: string;
}
export interface UpdateFraudProfileMutationInput
  extends Omit<UpdateFraudProfileInput, 'restrictions' | 'id'> {
  restrictions: Array<FraudProfilesRestrictionType>;
}

export const useCreateFraudProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((input: FraudProfilesInput) => createFraudProfile(input), {
    onSuccess: () => {
      queryClient.invalidateQueries(fraudProfileQueryKeys.listFraudProfile);
      return queryClient.invalidateQueries([fraudProfileQueryKeys.fraudProfileDetails]);
    },
  });
};

export const useUpdateFraudProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((input: FraudProfilesInput) => updateFraudProfile(input), {
    onSuccess: () => {
      queryClient.invalidateQueries(fraudProfileQueryKeys.listFraudProfile);
      return queryClient.invalidateQueries([fraudProfileQueryKeys.fraudProfileDetails]);
    },
  });
};
