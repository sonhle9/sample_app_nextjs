import {useQuery} from 'react-query';
import {getSnapshotReports} from 'src/react/services/api-reports.service';
import {ISnapshotParams} from 'src/react/services/api-reports.type';
import {AxiosError} from 'axios';

export const useGetSnapshotReports = (reportFolder?: string, params?: ISnapshotParams) =>
  useQuery(
    ['getSnapshotReports', reportFolder, params],
    () => getSnapshotReports(reportFolder, params),
    {
      enabled: !!reportFolder,
      retry: (_, error) => {
        return (error as AxiosError)?.response?.status !== 404;
      },
    },
  );
