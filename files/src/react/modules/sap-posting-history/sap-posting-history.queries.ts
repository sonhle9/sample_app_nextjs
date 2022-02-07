import {useQuery} from 'react-query';
import {
  getSapPostingHistory,
  getSapPostingHistoryDetails,
  getSapPostingHistoryGlPostings,
} from 'src/react/services/api-ledger.service';

export const useSapPostingHistory = (
  pagination: Omit<Parameters<typeof getSapPostingHistory>[0], 'from' | 'to'> & {
    range: [string, string];
  },
) => {
  return useQuery(
    [CACHE_KEYS.sapPostingHistory, pagination],
    () => {
      const {
        range: [from, to],
        ...filter
      } = pagination;
      return getSapPostingHistory({...filter, from, to});
    },
    {
      keepPreviousData: true,
    },
  );
};

export const useSapPostingHistoryDetails = (id: string) => {
  return useQuery([CACHE_KEYS.sapPostingHistoryDetails, id], () => getSapPostingHistoryDetails(id));
};

export const useSapPostingHistoryGlPostings = (id: string, pagination) => {
  return useQuery(
    [CACHE_KEYS.sapPostingHistoryGlPostings, pagination],
    () => {
      return getSapPostingHistoryGlPostings(id, pagination);
    },
    {
      keepPreviousData: true,
    },
  );
};

const CACHE_KEYS = {
  sapPostingHistory: 'SAP_POSTING_HISTORY',
  sapPostingHistoryDetails: 'SAP_POSTING_HISTORY_DETAILS',
  sapPostingHistoryGlPostings: 'SAP_POSTING_HISTORY_GL_POSTINGS',
};
