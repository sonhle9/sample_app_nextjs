import {apiClient} from 'src/react/lib/ajax';
import {environment} from '../../../environments/environment';
import {
  CreateSftpConnectionConfig,
  SftpConnectionConfig,
  UpdateSftpConnectionConfig,
} from './partner-sftp.type';

const baseUrl = `${environment.partnerSftpBaseUrl}/api/partner-sftp`;

export const getConnections = async (targetId: string, targetType: string) => {
  const url = `${baseUrl}/admin/connections?targetType=${targetType}&targetId=${targetId}`;
  const {data: connections} = await apiClient.get<SftpConnectionConfig[]>(url);
  return connections;
};

export const createConnection = async (params: CreateSftpConnectionConfig) => {
  const url = `${baseUrl}/admin/connections`;
  const {data: connection} = await apiClient.post<SftpConnectionConfig>(url, params);
  return connection;
};

export const updateConnection = async (
  connectionId: string,
  params: UpdateSftpConnectionConfig,
) => {
  const url = `${baseUrl}/admin/connections/${connectionId}`;
  const {data: connection} = await apiClient.put<SftpConnectionConfig>(url, params);
  return connection;
};
