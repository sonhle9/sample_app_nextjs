import {BareButton, Card, DataTable as Table, formatMoney, TextEllipsis} from '@setel/portal-ui';
import * as React from 'react';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {listBulkWalletGrantingHistory} from 'src/react/services/api-ops.service';
import {
  queryKeys,
  useDownloadFailedBulkWalletGrantingFile,
} from '../wallet-balance-granting.queries';

export const WalletBalanceGrantingBatchHistory = () => {
  const {query} = useDataTableState({
    initialFilter: {},
    queryKey: queryKeys.listBulkWalletGrantingHistory,
    queryFn: (data) => listBulkWalletGrantingHistory(data),
    refetchOnWindowFocus: false,
  });

  return (
    <Table
      heading={<Card.Heading title="Wallet balance grantings batch history" />}
      isLoading={query.isLoading}
      isFetching={query.isFetching}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>FILE NAME</Table.Th>
          <Table.Th className="text-right">GRANTED SUCCESSFULLY</Table.Th>
          <Table.Th className="text-right">GRANTED FAILED</Table.Th>
          <Table.Th>USER ID</Table.Th>
          <Table.Th className="text-right">FAILED FILE</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {query.data &&
          query.data.map((history) => (
            <Table.Tr key={history.fileId}>
              <Table.Td>{history.fileName}</Table.Td>
              <Table.Td className="text-right">
                {formatMoney(history.successfullTransactionsCount, {decimalPlaces: 0})}
              </Table.Td>
              <Table.Td className="text-right">
                {formatMoney(history.failureTransactionsCount, {decimalPlaces: 0})}
              </Table.Td>
              <Table.Td>
                <TextEllipsis text={history.userId} widthClass="w-36" />
              </Table.Td>
              <Table.Td className="text-right">
                {history.failureTransactionsCount > 0 ? (
                  <DownloadBtn fileId={history.fileId} fileName={history.fileName} />
                ) : null}
              </Table.Td>
            </Table.Tr>
          ))}
      </Table.Tbody>
    </Table>
  );
};

const DownloadBtn = (props: {fileId: string; fileName: string}) => {
  const {mutate: download, isLoading} = useDownloadFailedBulkWalletGrantingFile(props.fileName);

  return (
    <BareButton
      onClick={() => download(props.fileId)}
      disabled={isLoading}
      className="text-brand-500">
      {isLoading ? 'DOWNLOADING...' : 'DOWNLOAD'}
    </BareButton>
  );
};
