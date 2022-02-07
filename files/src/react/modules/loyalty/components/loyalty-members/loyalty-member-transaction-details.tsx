import * as React from 'react';
import {useGetTransactionById} from '../../loyalty.queries';
import {
  Card,
  CardContent,
  CardHeading,
  Fieldset,
  FieldContainer,
  TextEllipsis,
  JsonPanel,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Badge,
  formatDate,
  formatMoney,
} from '@setel/portal-ui';
import {TransactionTypes, TransactionTypesName, TransactionStatusName} from '../../loyalty.type';
import {getLoyaltyAmount} from 'src/shared/helpers/get-loyalty-amount';

const FieldWrapper = ({label, value}: {label: string; value?: string | React.ReactNode}) => {
  return (
    <FieldContainer label={label} layout="horizontal-responsive" labelAlign="start">
      <div className="text-sm pt-2.5">{value || '-'}</div>
    </FieldContainer>
  );
};

export type LoyaltyMemberTransactionDetailsProps = {
  id: string;
};

export type JSONObject = {[key: string]: string | string[]};

export const LoyaltyMemberTransactionDetails = ({id}) => {
  const {data} = useGetTransactionById(id);

  const dataObject = data as unknown as JSONObject;

  TransactionTypesName.set(TransactionTypes.EARN, 'Point earnings');
  TransactionTypesName.set(TransactionTypes.REDEEM, 'Point redemptions');

  return (
    <div className="mx-auto px-16">
      <div className="mb-10 pt-8">
        <TextEllipsis
          className="flex-grow text-2xl pb-4"
          text="Member details"
          widthClass="w-full"
        />
        <Card className="mb-10" data-testid="transaction-summary">
          <CardHeading title="Point details" />
          <CardContent>
            <Fieldset legend="GENERAL">
              <FieldWrapper label="Transaction no" value={data?.id} />
              <FieldWrapper label="Transaction type" value={TransactionTypesName.get(data?.type)} />
              <FieldWrapper label="Customer" value={data?.userAccount?.fullName} />
              <FieldWrapper
                label="Points amount"
                value={data?.amount || data?.deductedPoints ? `${getLoyaltyAmount(data)} pts` : '-'}
              />
              <FieldWrapper
                label="Transaction status"
                value={
                  data?.status && (
                    <Badge
                      color={TransactionStatusName.get(data.status)?.color || 'grey'}
                      rounded="rounded"
                      className="uppercase">
                      {TransactionStatusName.get(data.status).altText ||
                        TransactionStatusName.get(data.status).text}
                    </Badge>
                  )
                }
              />
              <FieldWrapper
                label="Created on"
                value={data?.createdAt ? formatDate(data.createdAt) : ''}
              />
            </Fieldset>
            {Boolean(data?.loyaltyTransactions?.length) && (
              <Fieldset legend="ITEM">
                <DataTable data-testid="transaction-table">
                  <DataTableRowGroup groupType="thead">
                    <Tr>
                      <Td>Item information</Td>
                      <Td className="text-right">Unit price (RM)</Td>
                      <Td className="text-right">Quantity</Td>
                      <Td className="text-right">Amount (PTS)</Td>
                    </Tr>
                  </DataTableRowGroup>
                  <DataTableRowGroup>
                    {data.loyaltyTransactions.map((transaction, index) => (
                      <Tr key={index}>
                        <Td>{transaction.categoryName}</Td>
                        <Td className="text-right">{formatMoney(transaction.categoryUnitPrice)}</Td>
                        <Td className="text-right">{transaction.categoryQuantity}</Td>
                        <Td className="text-right">{transaction.categoryValue}</Td>
                      </Tr>
                    ))}
                  </DataTableRowGroup>
                </DataTable>
              </Fieldset>
            )}
          </CardContent>
        </Card>
        <JsonPanel defaultOpen allowToggleFormat json={dataObject} />
      </div>
    </div>
  );
};
