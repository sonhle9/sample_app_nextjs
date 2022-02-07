import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {
  FeeSetting,
  IEditFeeSetting,
  IEditFeeSettingBody,
  IFeeSettingsRequest,
} from './fee-settings.type';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';

const feeSettingsUrl = `${environment.feesApiBaseUrl}/api/fees/admin/fee-settings`;

export const getFeeSettings = async (req: IFeeSettingsRequest = {}) => {
  const {data: feeSettings, headers} = await apiClient.get<FeeSetting[]>(feeSettingsUrl, {
    params: {
      perPage: req.perPage,
      page: req.page,
    },
  });

  return {
    feeSettings,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getFeeSettingDetails = (id: string): Promise<IEditFeeSetting> =>
  apiClient.get<IEditFeeSetting>(`${feeSettingsUrl}/${id}`).then((res) => res.data);

export const editFeeSetting = (feeSettingId: string, body: IEditFeeSettingBody) => {
  return apiClient
    .put<IEditFeeSetting>(`${feeSettingsUrl}/${feeSettingId}`, body)
    .then((res) => res.data);
};
