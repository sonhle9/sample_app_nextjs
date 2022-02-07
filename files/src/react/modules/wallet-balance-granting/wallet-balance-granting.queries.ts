import * as React from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {downloadFile} from 'src/react/lib/utils';
import {
  BulkWalletGrantingRecord,
  getFailedBulkWalletGrantingFile,
  parseBulkWalletGrantingFile,
} from 'src/react/services/api-ops.service';
import {
  bulkGrantWalletBalance,
  getBulkGrantWalletBalanceProcessed,
} from 'src/react/services/api-payments.service';
export {BulkWalletGrantingRecord} from 'src/react/services/api-ops.service';

export const queryKeys = {
  listBulkWalletGrantingHistory: 'listBulkWalletGrantingHistory',
  bulkGrantingProgress: 'bulkGrantingProgress',
};

export const useDownloadFailedBulkWalletGrantingFile = (fileName: string) =>
  useMutation(getFailedBulkWalletGrantingFile, {
    onSuccess: (data) => downloadFile(data, fileName),
  });

export const useParseBulkWalletGrantingFile = (options?: {
  onSuccess: (records: Array<BulkWalletGrantingRecord>) => void;
}) => useMutation(parseBulkWalletGrantingFile, options);

export const useBulkGrantWalletBalance = (options: {
  onComplete: () => void;
  onFailed: () => void;
}) => {
  const [uploadStatus, setUploadStatus] = React.useState<'pending' | 'processing'>('pending');

  const grantBalanceMutation = useMutation(bulkGrantWalletBalance, {
    onSuccess: () => setUploadStatus('processing'),
    onError: options.onFailed,
  });

  const queryClient = useQueryClient();

  const processQuery = useQuery({
    queryKey: [queryKeys.bulkGrantingProgress, grantBalanceMutation.data?.id],
    queryFn: () => getBulkGrantWalletBalanceProcessed(grantBalanceMutation.data?.id),
    enabled: !!(
      grantBalanceMutation.data &&
      grantBalanceMutation.data.id &&
      uploadStatus === 'processing'
    ),
    refetchInterval: 1000,
    onSuccess: ({processed}) => {
      if (processed >= grantBalanceMutation.data.data.length) {
        queryClient.invalidateQueries(queryKeys.listBulkWalletGrantingHistory);
        setUploadStatus('pending');
        grantBalanceMutation.reset();
        options.onComplete();
      }
    },
  });

  return {
    grantBalance: grantBalanceMutation.mutate,
    isGranting: grantBalanceMutation.isLoading,
    isProcessing: uploadStatus === 'processing',
    uploadStatus,
    progress: processQuery.data
      ? {
          processed: processQuery.data.processed,
          total: grantBalanceMutation.data.data.length,
        }
      : undefined,
  };
};
