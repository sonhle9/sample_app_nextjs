import {
  Card,
  CardContent,
  CardHeading,
  classes,
  DescItem,
  DescList,
  formatDate,
  JsonPanel,
  formatMoney,
} from '@setel/portal-ui';
import * as React from 'react';
import {mapSettlementTypeToPaymentMethod} from 'src/react/services/api-settlements.type';
import {useExceptionDetails} from '../exceptions.queries';
import {ExceptionTxTable} from './exception-tx-table';

interface IExceptionDetailsProps {
  id: string;
}
export const ExceptionDetails = (props: IExceptionDetailsProps) => {
  const {id} = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const {data} = useExceptionDetails(id);
  React.useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  });

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Batch upload settlement details</h1>
        </div>
        <>
          {isLoading && <p>Loading...</p>}
          {!isLoading && data && (
            <Card className="mb-8">
              <CardHeading title="General details"></CardHeading>
              <CardContent>
                <DescList>
                  <DescItem
                    label="Transaction date"
                    value={
                      data.createdAt &&
                      formatDate(data.createdAt, {
                        formatType: 'dateOnly',
                      })
                    }
                  />
                  <DescItem
                    label="Settlement date"
                    value={
                      data.createdAt &&
                      formatDate(data.createdAt, {
                        formatType: 'dateAndTime',
                      })
                    }
                  />
                  <DescItem label="Merchant name" value={data.merchantName || '-'} />
                  <DescItem
                    label="Card Type"
                    value={
                      data.settlementType
                        ? mapSettlementTypeToPaymentMethod.get(data.settlementType)
                        : '-'
                    }
                  />
                  <DescItem
                    label="Number of processed transaction "
                    value={data?.transactionNum || 0}
                  />
                  <DescItem
                    label="Amount"
                    value={'RM' + formatMoney(data.transactionTotalAmount, '')}
                  />
                  <DescItem
                    label="Batch number"
                    value={data?.posBatchSettlementId ? data?.posBatchSettlementId : '-'}
                  />
                  <DescItem label="RRN" value={data?.rrn || '-'} />
                  <DescItem label="STAN" value={data?.stan || '-'} />
                  <DescItem label="Response description" value={'-'} />
                </DescList>
              </CardContent>
            </Card>
          )}
        </>
        <ExceptionTxTable exceptionId={id} />
        <>
          <Card className="mb-8">
            <JsonPanel json={data as any} />
          </Card>
        </>
      </div>
    </>
  );
};
