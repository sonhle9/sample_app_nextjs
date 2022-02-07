import {useMutation, useQuery, useQueryClient} from 'react-query';
import {UpdateSftpConnectionConfig} from '.';
import {getConnections, createConnection, updateConnection} from './partner-sftp.service';
import {SftpTargetType, CreateSftpConnectionConfig} from './partner-sftp.type';

export const partnerSftpQueryKey = {
  adminGetConnections: 'adminGetConnections',
};

export const useGetConnectionConfig = (targetId: string, targetType: SftpTargetType) => {
  return useQuery([partnerSftpQueryKey.adminGetConnections, targetId, targetType], () =>
    getConnections(targetId, targetType),
  );
};

export const useCreateConnectionConfig = (targetId: string, targetType: SftpTargetType) => {
  const queryClient = useQueryClient();
  return useMutation(async (params: CreateSftpConnectionConfig) => createConnection(params), {
    onSuccess: () => {
      queryClient.invalidateQueries([
        partnerSftpQueryKey.adminGetConnections,
        targetId,
        targetType,
      ]);
    },
  });
};

export const useUpdateConnectionConfig = (
  targetId: string,
  targetType: SftpTargetType,
  connectionId: string,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (params: UpdateSftpConnectionConfig) => updateConnection(connectionId, params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          partnerSftpQueryKey.adminGetConnections,
          targetId,
          targetType,
        ]);
      },
    },
  );
};
