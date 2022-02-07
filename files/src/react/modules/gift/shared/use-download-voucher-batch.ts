import {getVoucherBatchCSV} from '../voucher-batch.service';
import {downloadFile} from 'src/react/lib/utils';
import {formatDate} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';

export const useDownloadVoucherBatch = () => {
  const notification = useNotification();

  const downloadVoucherBatch = async (voucherName: string, batchId: string) => {
    try {
      const csvData = await getVoucherBatchCSV(batchId);
      await downloadFile(
        csvData,
        `${voucherName}${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
      );
      notification({
        variant: 'success',
        title: 'Successful!',
        description: 'CSV file successfully downloaded.',
      });
    } catch (err) {
      notification({
        variant: 'error',
        title: 'Error',
        description: err?.message,
      });
    }
  };
  return downloadVoucherBatch;
};
