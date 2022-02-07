import {AxiosError} from 'axios';
import {useMutation, useQuery, UseMutationOptions, UseQueryOptions} from 'react-query';
import {IPaginationParam, IPaginationResult} from 'src/react/lib/ajax';
import {
  deleteAttributionRule,
  getAttributionRule,
  getAttributionRules,
  postAttributionRule,
  putAttributionRule,
  uploadAttributionRulesCSV,
} from './attribution.service';
import {
  IAttributeFilter,
  IAttributeRuleReadOnly,
  IAttributionRule,
  IAttributeError,
  IAttributeCsvUploadResponse,
} from './types';

export function useCreateAttributionRule(
  config?: UseMutationOptions<
    IAttributionRule,
    AxiosError<IAttributeError>,
    IAttributionRule,
    unknown
  >,
) {
  return useMutation(postAttributionRule, config);
}

export function useEditAttributionRule(
  config?: UseMutationOptions<
    IAttributionRule,
    AxiosError<IAttributeError>,
    {referenceId: string; newRule: IAttributionRule},
    unknown
  >,
) {
  return useMutation(putAttributionRule, config);
}

export function useDeleteAttributionRule(
  config?: UseMutationOptions<boolean, AxiosError<IAttributeError>, string, unknown>,
) {
  return useMutation(deleteAttributionRule, config);
}

export function useAttributionRuleList(pagination: IPaginationParam, filters?: IAttributeFilter) {
  const query = useQuery<IPaginationResult<IAttributeRuleReadOnly>>(
    ['attributionRuleList', pagination, filters],
    () => getAttributionRules(pagination, filters),
    {cacheTime: 60 * 1000},
  );
  return query;
}

export function useAttributionRule<Result = IAttributeRuleReadOnly>(
  referenceId: string,
  config?: UseQueryOptions<IAttributeRuleReadOnly, AxiosError<IAttributeError>, Result>,
) {
  return useQuery([referenceId], () => getAttributionRule(referenceId), config);
}

export function useAttributionRuleUpload(
  config?: UseMutationOptions<
    IAttributeCsvUploadResponse,
    AxiosError<IAttributeError>,
    File,
    unknown
  >,
) {
  return useMutation(uploadAttributionRulesCSV, config);
}
