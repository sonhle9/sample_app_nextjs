import {
  Button,
  Card,
  CardHeading,
  DataTable,
  EyeShowIcon,
  Text,
  DescList,
  DescItem,
  Badge,
  BadgeProps,
  formatMoney,
} from '@setel/portal-ui';
import * as React from 'react';
import {ColorMap} from 'src/app/cards/shared/enums';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {useRouter} from 'src/react/routing/routing.context';
import {ETransferType} from '../../cards/card.type';
import {getTransactionWithRequestID} from '../../transactions/transaction.service';

function changeTransferType(type) {
  switch (type) {
    case ETransferType.GRANT:
      return 'Grants card balance (CR)';
    case ETransferType.REVOKE:
      return 'Revoke card balance (DR)';
    default:
      return '-';
  }
}

export const getMerchantStatusBadgeColor = (status: string): BadgeProps['color'] => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'frozen':
      return 'error';
  }
  return 'grey';
};
interface IGiftCardTransferReference {
  type?: string;
  target?: string;
  requestID?: string;
}
interface FilterValue {
  requestId: string;
}
const GiftCardTransferReference: React.VFC<IGiftCardTransferReference> = (props) => {
  const initialFilter: FilterValue = {
    requestId: props.requestID,
  };
  const {
    query: {data: data},
  } = useDataTableState({
    initialFilter,
    queryKey: 'transaction-requestId',
    queryFn: (currentValues) => getTransactionWithRequestID(currentValues),
  });
  const router = useRouter();
  return (
    <>
      <Card>
        <CardHeading title="Reference">
          <Button
            variant="outline"
            leftIcon={<EyeShowIcon />}
            minWidth="none"
            onClick={() => {
              router.navigateByUrl(`/card-issuing/card-transactions?requestId=${props?.requestID}`);
            }}>
            VIEW TRANSACTION
          </Button>
        </CardHeading>
        <DataTable striped>
          <Card.Content>
            {data?.transactions?.map((transaction, index) => (
              <div key={index}>
                <div>
                  <div className="grid grid-cols-7 pt-2">
                    <Text
                      color="lightgrey"
                      className="uppercase font-bold tracking-widest text-xs w-36">
                      Merchant details
                    </Text>
                    <DescList className="col-span-5 pl-16">
                      <tr className="w-48">
                        <td>
                          <DescItem
                            label=""
                            valueClassName="text-mediumgrey pb-5 pl-2"
                            value="Merchant ID"
                          />
                          <DescItem
                            label=""
                            valueClassName="text-mediumgrey pb-5 pl-2"
                            value="Merchant name"
                          />
                          <DescItem
                            label=""
                            valueClassName="text-mediumgrey pb-5 pl-2"
                            value="Status"
                          />
                          <DescItem
                            label=""
                            valueClassName="text-mediumgrey pb-5 pl-2"
                            value="Prepaid balance"
                          />
                        </td>
                      </tr>
                      <td>
                        <DescItem
                          label=""
                          valueClassName="text-black  pb-5"
                          value={transaction?.merchantId || '-'}
                        />
                        <DescItem
                          label=""
                          valueClassName="text-black  pb-5"
                          value={transaction?.merchant?.name || '-'}
                        />
                        <DescItem
                          label=""
                          valueClassName="text-black  pb-5"
                          value={
                            transaction?.merchant?.status ? (
                              <Badge
                                color={getMerchantStatusBadgeColor(transaction?.merchant?.status)}
                                className={'uppercase'}>
                                {transaction?.merchant?.status}
                              </Badge>
                            ) : (
                              '-'
                            )
                          }
                        />
                        <DescItem
                          label=""
                          valueClassName="text-black  pb-5"
                          value={
                            transaction?.merchant?.balances?.find(
                              (value) => value?.type === 'PREPAID',
                            )
                              ? `RM${formatMoney(
                                  transaction?.merchant?.balances?.find(
                                    (value) => value?.type === 'PREPAID',
                                  ).balance,
                                )}`
                              : '-'
                          }
                        />
                      </td>
                    </DescList>
                  </div>
                </div>
                <div className="divide-y pb-4">
                  <div></div>
                  <div className="text-center py-2 border-gray-200"></div>
                </div>
                <div>
                  <div className="grid grid-cols-7 pb-3">
                    <Text
                      color="lightgrey"
                      className="uppercase font-bold tracking-widest text-xs w-56">
                      Card details
                    </Text>
                    <DescList className="col-span-5 pl-16">
                      <tr className="w-48">
                        <td>
                          <DescItem
                            label=""
                            valueClassName="text-mediumgrey pb-5 pl-2"
                            value="Card number"
                          />
                          <DescItem
                            label=""
                            valueClassName="text-mediumgrey pb-5 pl-2"
                            value="Status"
                          />
                          <DescItem
                            label=""
                            valueClassName="text-mediumgrey pl-2"
                            value="Card balance"
                          />
                        </td>
                      </tr>
                      <td>
                        <div className="text-black  pb-5 text-sm">
                          {transaction?.cardDetail?.type && (
                            <div className="float-left w-16 h-8 pr-4">
                              <img
                                style={{top: -5}}
                                src={`assets/images/logo-card/card-${transaction?.cardDetail?.type}.png`}
                                className="w-full h-8 relative"
                              />
                            </div>
                          )}
                          {transaction?.cardDetail?.cardNumber || '-'}
                        </div>
                        <DescItem
                          label=""
                          valueClassName="text-black  pb-5"
                          value={
                            transaction?.cardDetail?.status ? (
                              <Badge
                                className="tracking-wider font-semibold uppercase"
                                rounded="rounded"
                                color={ColorMap[transaction?.cardDetail?.status]}
                                style={{width: 'fit-content'}}>
                                {transaction?.cardDetail?.status && transaction?.cardDetail?.status}
                              </Badge>
                            ) : (
                              '-'
                            )
                          }
                        />
                        <DescItem
                          label=""
                          valueClassName="text-black "
                          value={
                            transaction?.cardDetail?.cardBalance?.balance
                              ? `RM${formatMoney(transaction?.cardDetail?.cardBalance?.balance)}`
                              : `RM0.00`
                          }
                        />
                      </td>
                    </DescList>
                  </div>
                </div>
                <div className="divide-y py-2 pb-2">
                  <div></div>
                  <div className="text-center py-2 border-gray-200"></div>
                </div>
                <div>
                  <div className="grid grid-cols-7">
                    <Text
                      color="lightgrey"
                      className="uppercase font-bold tracking-widest text-xs w-44">
                      Others
                    </Text>
                    <DescList className="col-span-5 pl-16">
                      <tr className="w-48">
                        <td>
                          <DescItem
                            label=""
                            valueClassName="text-mediumgrey pl-2"
                            value={'Transfer type'}
                          />
                        </td>
                      </tr>
                      <td>
                        <DescItem
                          label=""
                          valueClassName="text-black "
                          value={props.type ? changeTransferType(props.type) : '-'}
                        />
                      </td>
                    </DescList>
                  </div>
                </div>
              </div>
            ))}
          </Card.Content>
        </DataTable>
      </Card>
    </>
  );
};

export default GiftCardTransferReference;
