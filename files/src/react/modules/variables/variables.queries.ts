import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  useQueryClient,
} from 'react-query';
import {
  getTags,
  getVariable,
  getVariables,
  createVariable,
  updateVariable,
  deleteVariable,
  getVariableHistory,
  getTargetingOptions,
} from './variables.service';
import {
  IPaginationParam,
  IPaginationResult,
  ITag,
  IVariable,
  IVariableError,
  IVariablesFilter,
} from './types';
import {AxiosError} from 'axios';

export function useVariables(pagination: IPaginationParam, filters?: IVariablesFilter) {
  const query = useQuery<IPaginationResult<IVariable[]>>(
    ['variablesList', pagination, filters],
    () => getVariables(pagination, filters),
    {cacheTime: 60 * 1000},
  );
  return query;
}

export function useTags() {
  const query = useQuery<ITag[]>(['tagsList'], () => getTags(), {cacheTime: 60 * 1000});
  return query;
}

export function useVariableDetails(
  id: string,
  options: UseQueryOptions<IVariable, AxiosError> = {},
) {
  return useQuery(['variableDetails', id], () => getVariable(id), options);
}

export function useUpdateVariableDetails() {
  return useMutation(updateVariable);
}

export function useCreateVariable() {
  return useMutation(createVariable);
}

export function useUpdateVariable(
  config?: UseMutationOptions<
    IVariable,
    AxiosError<IVariableError>,
    {key: string; variable: IVariable},
    unknown
  >,
) {
  const queryClient = useQueryClient();
  return useMutation(updateVariable, {
    onSuccess: (data, {key}) => {
      queryClient.setQueryData(['variableDetails', key], data);
      queryClient.invalidateQueries(['variableHistory', key]);
    },
    ...config,
  });
}

export function useDeleteVariable(
  config?: UseMutationOptions<null, AxiosError<IVariableError>, {key: string}, unknown>,
) {
  return useMutation(deleteVariable, {...config});
}

export function useVariableHistory(id: string, pagination: IPaginationParam) {
  const query = useQuery(['variableHistory', id, pagination], () =>
    getVariableHistory(id, pagination),
  );
  return query;
}

export function useTargetingOptions() {
  const query = useQuery(['targetingOptions'], () => getTargetingOptions());
  return query;
}
