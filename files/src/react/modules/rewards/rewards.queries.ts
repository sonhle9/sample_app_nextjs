import {useMutation} from 'react-query';
import {
  downloadLeaderboardCsv,
  IListLeaderboardParams,
} from 'src/react/services/api-rewards.service';

export const useDownloadReferralLeaderboard = () => {
  return useMutation((params: IListLeaderboardParams) => downloadLeaderboardCsv(params));
};
