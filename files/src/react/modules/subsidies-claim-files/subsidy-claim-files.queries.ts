import {useQuery} from 'react-query';

import {getSubsidyClaimFiles} from './subsidy-claim-files.services';

const SUBSIDY_CLAIM_FILES_KEY = 'SUBSIDY_CLAIM_FILES_KEY';

export const useSubsidyClaimFiles = (filter: Parameters<typeof getSubsidyClaimFiles>[0]) => {
  return useQuery([SUBSIDY_CLAIM_FILES_KEY, filter], () => getSubsidyClaimFiles(filter), {
    keepPreviousData: true,
  });
};
