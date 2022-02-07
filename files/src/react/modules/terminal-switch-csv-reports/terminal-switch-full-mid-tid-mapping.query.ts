import {useQuery} from 'react-query';
import {getFullMidTidMapping} from './terminal-switch-full-mid-tid-mapping.service';

const LEGACY_TERMINAL_FULL_MID_TID_MAPPING = 'full_mid_tid_mapping';

export const useFullMidTidReport = (filter: Parameters<typeof getFullMidTidMapping>[0]) => {
  return useQuery([LEGACY_TERMINAL_FULL_MID_TID_MAPPING, filter], async () =>
    getFullMidTidMapping(filter),
  );
};
