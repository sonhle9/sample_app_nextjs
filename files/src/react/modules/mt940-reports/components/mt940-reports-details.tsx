import {
  Alert,
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DownloadIcon,
  DropdownMenu,
  DropdownSelect,
  FieldContainer,
  formatDate,
  formatMoney,
  JsonPanel,
  ReloadIcon,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {downloadFile} from 'src/react/lib/utils';
import {Mt940TransactionTypes} from 'src/react/services/api-processor.enum';
import {
  getMT940ReportTransactionsCSV,
  getMT940ReportTransactionsTXT,
  syncMT940Report,
} from 'src/react/services/api-processor.service';
import {useMT940Details, useMT940ReportTransactions} from '../mt940-reports.queries';

type MT940ReportsDetailsProps = {
  id: string;
  account: 'OPERATING' | 'COLLECTION';
};

export const MT940ReportsDetails = (props: MT940ReportsDetailsProps) => {
  const {id, account} = props;
  const [transactionType, setTransactionType] = React.useState('');

  const {data} = useMT940ReportTransactions(id, {
    transactionType: transactionType as Mt940TransactionTypes,
  });
  const {data: mt940DetailsData, isLoading: isDetailsLoading} = useMT940Details(id);
  const [syncMessage, setSyncMessage] = React.useState('');

  return (
    <PageContainer
      className="space-y-6"
      heading={`MT940 for ${account.toLocaleLowerCase()} account report`}
      action={
        <div>
          <Button
            leftIcon={<ReloadIcon />}
            onClick={async () => {
              const {data: responseSyncData} = await syncMT940Report(id);
              responseSyncData?.message && setSyncMessage(responseSyncData.message);
            }}
            variant="outline"
            className="mr-3">
            RELOAD
          </Button>
          <DropdownMenu leftIcon={<DownloadIcon />} variant="outline" label="DOWNLOAD">
            <DropdownMenu.Items className="min-w-32">
              <DropdownMenu.Item
                onSelect={async () => {
                  const csvData = await getMT940ReportTransactionsCSV(
                    id,
                    transactionType as Mt940TransactionTypes,
                  );
                  downloadFile(
                    csvData,
                    `mt940-${id}-transactions-${formatDate(new Date(), {
                      format: 'yyyyMMddhhmmss',
                    })}.csv`,
                  );
                }}>
                Download CSV
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={async () => {
                  const txtData = await getMT940ReportTransactionsTXT(id);
                  downloadFile(
                    txtData,
                    mt940DetailsData
                      ? `${mt940DetailsData.fileName}`
                      : `mt940-${id}-transactions-${formatDate(new Date(), {
                          format: 'yyyyMMddhhmmss',
                        })}.txt`,
                  );
                }}>
                Download .TXT
              </DropdownMenu.Item>
            </DropdownMenu.Items>
          </DropdownMenu>
        </div>
      }>
      {syncMessage && <Alert variant="success" description={syncMessage} />}
      <JsonPanel
        title="General"
        defaultOpen
        allowToggleFormat
        json={
          mt940DetailsData
            ? {
                accountNo: mt940DetailsData.accountNo,
                postingDate: mt940DetailsData.fileDate,
                openingBalance: formatMoney(mt940DetailsData.balance.opening.amount, 'RM'),
                totalDebitAmount: {
                  count: mt940DetailsData.debit.count,
                  amount: formatMoney(mt940DetailsData.debit.amount, 'RM'),
                },
                totalCreditAmount: {
                  count: mt940DetailsData.credit.count,
                  amount: formatMoney(mt940DetailsData.credit.amount, 'RM'),
                },
                closingBalance: formatMoney(mt940DetailsData.balance.closing.amount, 'RM'),
              }
            : {}
        }
      />
      <DataTable
        heading={
          <div className="flex px-4 py-5 sm:px-7 border-b border-gray-200">
            <FieldContainer
              label={<span className="inline-block w-20">Entry type</span>}
              layout="horizontal"
              className="mb-0">
              <DropdownSelect<string>
                value={transactionType}
                onChangeValue={setTransactionType}
                options={transOptions}
                className="w-48"
              />
            </FieldContainer>
          </div>
        }
        isLoading={isDetailsLoading}>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>ENTRY TYPE</Td>
            <Td>TRANSACTION DATE</Td>
            <Td className="text-right">TRANS. AMOUNT (RM)</Td>
            <Td>PAYMENT DESC 3</Td>
            <Td>PAYMENT DESC 1</Td>
            <Td>PAYMENT DESC 2</Td>
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup>
          {data &&
            data.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{titleCase(transaction.transactionType)}</Td>
                <Td>{formatDate(transaction.transactionDate, {formatType: 'dateOnly'})}</Td>
                <Td className="text-right">{formatMoney(transaction.amount)}</Td>
                <Td>{transaction.paymentDesc3}</Td>
                <Td>{transaction.paymentDesc1}</Td>
                <Td>{transaction.paymentDesc2}</Td>
              </Tr>
            ))}
        </DataTableRowGroup>
      </DataTable>
    </PageContainer>
  );
};

const transOptions = [
  {
    value: '',
    label: 'All',
  },
].concat(
  Object.values(Mt940TransactionTypes).map((value) => ({
    value,
    label: titleCase(value),
  })),
);
