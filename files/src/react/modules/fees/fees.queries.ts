import {useMutation, useQuery} from 'react-query';
import {getFees, getReportPresignedUrl, sendEmail} from './fees.service';

const FEES_LISTING = 'fees_listing';
const FEES = 'fees';

export const useFees = (filter: Parameters<typeof getFees>[0]) => {
  return useQuery([FEES_LISTING, filter], () => getFees(filter), {
    keepPreviousData: true,
  });
};

export const useFeeSendEmails = () =>
  useMutation((data: {emails: string[]; filter: any}) => sendEmail(data));

export const useReportDownloadUrl = (generationId: string) => {
  return useQuery([FEES, generationId], () => getReportPresignedUrl(generationId), {
    staleTime: Infinity,
  });
};
