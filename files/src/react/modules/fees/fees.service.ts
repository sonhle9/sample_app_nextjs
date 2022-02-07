import {IFee, IFeesFilterRequest} from './fees.type';
import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString} from 'src/react/lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';

const apiFees = `${environment.feesApiBaseUrl}/api/fees/admin/fee-transactions`;

export const getFees = async (filter: IFeesFilterRequest = {}) => {
  const {data: fees, headers} = await apiClient.get<IFee[]>(apiFees, {
    params: filterEmptyString(filter),
  });

  return {
    fees,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getReportPresignedUrl = async (generationId: string) => {
  return apiClient.get<any>(`${apiFees}/download-url`, {
    params: {generationId},
  });
};

export const sendEmail = ({emails, filter}: {emails: string[]; filter: IFeesFilterRequest}) => {
  return apiClient
    .post<any>(
      `${apiFees}/send-reports`,
      {emails},
      {
        params: filterEmptyString(filter),
      },
    )
    .then((res) => res.data);
};
