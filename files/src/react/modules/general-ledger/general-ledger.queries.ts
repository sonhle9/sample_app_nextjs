import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createGeneralLedgerParameter,
  disableGeneralLedgerParameter,
  enableGeneralLedgerParameter,
  getGeneralLedgerException,
  getGeneralLedgerExceptions,
  getGeneralLedgerParameter,
  getGeneralLedgerParameters,
  updateGeneralLedgerParameter,
  rectifyGeneralLedgerException,
} from 'src/react/services/api-ledger.service';
import {IGeneralLedgerParameter} from 'src/react/services/api-ledger.type';
import {
  getGeneralLedgerPayoutsBatch,
  getGeneralLedgerPayoutsBatchDetails,
  getGeneralLedgerPayoutsByBatchId,
} from 'src/react/services/api-processor.service';

export const useGLParameters = (pagination: Parameters<typeof getGeneralLedgerParameters>[0]) => {
  const setGlCodeParameterDetails = useSetGlCodeParameterDetails();
  return useQuery(
    [CACHE_KEYS.glCodeParameters, pagination],
    () => getGeneralLedgerParameters(pagination),
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach(setGlCodeParameterDetails);
        }
      },
      keepPreviousData: true,
    },
  );
};

export const useGLParameterDetails = (id: string) => {
  return useQuery([CACHE_KEYS.glCodeParameterDetails, id], () => getGeneralLedgerParameter(id));
};

export const useCreateGLParameter = () => {
  const queryClient = useQueryClient();
  const setGlCodeParameterDetails = useSetGlCodeParameterDetails();
  return useMutation(
    (data: Parameters<typeof createGeneralLedgerParameter>[0]) =>
      createGeneralLedgerParameter(data),
    {
      onSuccess: (newParam) => {
        if (newParam) {
          queryClient.invalidateQueries([CACHE_KEYS.glCodeParameters]);
          setGlCodeParameterDetails(newParam);
        }
      },
    },
  );
};

export const useUpdateGLParameter = (id: string) => {
  const queryClient = useQueryClient();
  const setGlCodeParameterDetails = useSetGlCodeParameterDetails();
  return useMutation(
    (data: Parameters<typeof updateGeneralLedgerParameter>[1]) =>
      updateGeneralLedgerParameter(id, data),
    {
      onSuccess: (newParam) => {
        if (newParam) {
          queryClient.invalidateQueries([CACHE_KEYS.glCodeParameters]);
          setGlCodeParameterDetails(newParam);
        }
      },
    },
  );
};

export const useDisableGLParameter = (id: string) => {
  const queryClient = useQueryClient();
  const setGlCodeParameterDetails = useSetGlCodeParameterDetails();
  return useMutation(() => disableGeneralLedgerParameter(id), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([CACHE_KEYS.glCodeParameters]);
        setGlCodeParameterDetails(newParam);
      }
    },
  });
};

export const useEnableGLParameter = (id: string) => {
  const queryClient = useQueryClient();
  const setGlCodeParameterDetails = useSetGlCodeParameterDetails();
  return useMutation(() => enableGeneralLedgerParameter(id), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([CACHE_KEYS.glCodeParameters]);
        setGlCodeParameterDetails(newParam);
      }
    },
  });
};

export const useGLExceptions = (pagination: Parameters<typeof getGeneralLedgerExceptions>[0]) => {
  return useQuery(
    [CACHE_KEYS.glCodeExceptions, pagination],
    () => getGeneralLedgerExceptions(pagination),
    {
      keepPreviousData: true,
    },
  );
};

export const useGLExceptionsDetails = (id: string) => {
  return useQuery([CACHE_KEYS.glCodeExceptions, id], () => getGeneralLedgerException(id));
};

export const useGLExceptionRectify = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Parameters<typeof rectifyGeneralLedgerException>[0]) =>
      rectifyGeneralLedgerException(data),
    {
      onSuccess: (newParam) => {
        if (newParam) {
          queryClient.invalidateQueries([CACHE_KEYS.glCodeExceptions]);
          queryClient.setQueryData([CACHE_KEYS.glCodeExceptions, newParam.id], newParam);
        }
      },
    },
  );
};

export const useGLPayouts = (pagination: Parameters<typeof getGeneralLedgerPayoutsBatch>[0]) => {
  const setGlPayoutsDetails = useSetGlPayoutsDetails();
  return useQuery(
    [CACHE_KEYS.glPayouts, pagination],
    () => getGeneralLedgerPayoutsBatch(pagination),
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach(setGlPayoutsDetails);
        }
      },
      keepPreviousData: true,
    },
  );
};

export const useGLPayoutsDetails = (id: string) => {
  return useQuery([CACHE_KEYS.glPayouts, id], () => getGeneralLedgerPayoutsBatchDetails(id));
};

export const useGLPayoutByBatchId = (
  pagination: Parameters<typeof getGeneralLedgerPayoutsByBatchId>[0],
) => {
  const setGlPayoutsDetails = useSetGlPayoutsDetails();
  return useQuery(
    [CACHE_KEYS.glPayouts, pagination],
    () => getGeneralLedgerPayoutsByBatchId(pagination),
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach(setGlPayoutsDetails);
        }
      },
      keepPreviousData: true,
    },
  );
};

const useSetGlCodeParameterDetails = () => {
  const queryClient = useQueryClient();
  return function setGlCodeParameterDetails(data: IGeneralLedgerParameter) {
    queryClient.setQueryData([CACHE_KEYS.glCodeParameterDetails, data.id], data);
  };
};

const useSetGlPayoutsDetails = () => {
  const queryClient = useQueryClient();
  return function setGlPayoutsDetails(data) {
    queryClient.setQueryData([CACHE_KEYS.glPayouts, data.id], data);
  };
};

const CACHE_KEYS = {
  glCodeParameters: 'GL_CODE_PARAMETERS',
  glCodeParameterDetails: 'GL_CODE_PARAMETER_DETAILS',
  glCodeExceptions: 'GL_CODE_EXCEPTIONS',
  glPayouts: 'GL_PAYOUTS',
};
