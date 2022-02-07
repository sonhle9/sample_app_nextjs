import {apiClient} from '../../lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from '../../services/service.type';
import {environment} from 'src/environments/environment';
import {ISubsidyClaimFileParams, SubsidyClaimFile} from './subsidy-claim-files.types';

export const subsidyClaimFileUrl = `${environment.subsidyBaseUrl}/api/subsidies/subsidy-claim-file`;

export const getSubsidyClaimFiles = async (params: ISubsidyClaimFileParams) => {
  const {data: claimFiles, headers} = await apiClient.get<SubsidyClaimFile[]>(
    `${subsidyClaimFileUrl}`,
    {
      params,
    },
  );

  return {
    claimFiles,
    isEmpty: +headers[TOTAL_COUNT_HEADER_NAME] === 0,
    total: +headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getSubsidyClaimFileDownloadUrl = (YYMM: string): Promise<string> =>
  apiClient.get<string>(`${subsidyClaimFileUrl}/${YYMM}`).then((res) => res.data);
