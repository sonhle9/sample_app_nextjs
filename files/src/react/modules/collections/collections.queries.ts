import {useMutation, useQuery} from 'react-query';
import {getReportPresignedUrl, getTransactions, sendEmail} from './collections.service';
import {ICollectionsRequest} from './collections.type';

export const useListCollections = (filter: ICollectionsRequest) => {
  return useQuery(['GetListCollections', filter], () => getTransactions(filter), {
    keepPreviousData: true,
  });
};

export const useCollectionSendEmails = () =>
  useMutation((data: {emails: string[]; filter: ICollectionsRequest}) => sendEmail(data));

export const useReportDownloadUrl = (generationId: string) => {
  return useQuery(
    ['GetDownloadReportUrl', generationId],
    () => getReportPresignedUrl(generationId),
    {
      staleTime: Infinity,
    },
  );
};
