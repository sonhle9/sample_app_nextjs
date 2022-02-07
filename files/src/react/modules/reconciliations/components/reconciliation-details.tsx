import * as React from 'react';
import * as RS from '@setel/portal-ui';
import {useReconciliationDetails} from '../reconciliation.queries';
import {getReconAmountFields, ReconciliationStatusColorMap} from '../reconciliation.type';
import {ExceptionTxTable} from '../../exceptions/components/exception-tx-table';
import {
  mapSettlementTypeToPaymentMethod,
  ReconciliationType,
} from 'src/react/services/api-settlements.type';

const DescList = RS.DescList;
interface IReconciliationDetailsProps {
  id: string;
}

export const ReconciliationDetails = (props: IReconciliationDetailsProps) => {
  const {id} = props;
  const {data, isLoading} = useReconciliationDetails(id);
  return (
    <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex justify-between">
        <RS.Text className={RS.classes.h1}>Reconciliation details</RS.Text>
      </div>
      <>
        {isLoading && <p>Loading...</p>}
        {!isLoading && data && (
          <>
            <RS.Card className="mb-8 mt-8">
              <RS.CardHeading title="General"></RS.CardHeading>
              <RS.CardContent>
                <div className="flex">
                  <div className={`w-40 mt-1  capitalize text-base `}>
                    <RS.Text color="lightgrey" className={`${RS.classes.label} font-bold`}>
                      GENERAL
                    </RS.Text>
                  </div>
                  <div className="flex-1 ml-4 ">
                    <DescList isLoading={isLoading}>
                      <DescList.Item label="Merchant ID" value={data ? data.merchantId : '-'} />
                      <DescList.Item label="Merchant name" value={data ? data.merchantName : '-'} />
                      <DescList.Item
                        label="Status"
                        value={
                          <RS.Badge
                            className="tracking-wider font-semibold"
                            rounded="rounded"
                            size="large"
                            color={
                              ReconciliationStatusColorMap[
                                data.isAmountMatch ? 'SUCCEEDED' : 'FAILED'
                              ]
                            }>
                            {data && data.isAmountMatch ? 'SUCCEEDED' : 'FAILED'}
                          </RS.Badge>
                        }
                      />
                      <DescList.Item label="Type" value={data ? data.type : '-'} />
                      <DescList.Item
                        label="Card Type"
                        value={
                          data.settlementType
                            ? mapSettlementTypeToPaymentMethod.get(data.settlementType)
                            : '-'
                        }
                      />
                      <DescList.Item
                        label="Batch number"
                        value={data ? data.posBatchSettlementId : '-'}
                      />
                      <DescList.Item label="Terminal ID" value={data ? data.terminalId : '-'} />
                      <DescList.Item
                        label="Recon date"
                        value={
                          data
                            ? RS.formatDate(data.createdAt, {
                                formatType: 'dateAndTime',
                              })
                            : '-'
                        }
                      />
                      <DescList.Item
                        label="Error message"
                        value={data && data.isAmountMatch ? 'N/A' : 'Records not tally'}
                      />
                    </DescList>
                  </div>
                </div>
                <hr className="my-5" />
                <div className="flex">
                  <div className={`w-40 mt-1  capitalize`}>
                    <RS.Text color="lightgrey" className={`${RS.classes.label} font-bold`}>
                      TERMINAL
                    </RS.Text>
                  </div>
                  <div className="flex-1 ml-4 ">
                    <DescList>
                      {Object.entries(getReconAmountFields(data.settlementType)).map(([k, v]) => (
                        <DescList.Item
                          key={k}
                          label={v}
                          value={
                            data
                              ? k.includes('Amount')
                                ? RS.formatMoney(data.terminalAmounts[k], 'RM')
                                : data.terminalAmounts[k]
                              : '-'
                          }
                        />
                      ))}
                    </DescList>
                  </div>
                </div>
                <hr className="my-5" />
                <div className="flex">
                  <div className={`w-40 mt-1  capitalize`}>
                    <RS.Text color="lightgrey" className={`${RS.classes.label} font-bold`}>
                      SYSTEM
                    </RS.Text>
                  </div>
                  <div className="flex-1 ml-4 ">
                    <DescList>
                      {Object.entries(getReconAmountFields(data.settlementType)).map(([k, v]) => (
                        <DescList.Item
                          key={k}
                          label={v}
                          value={
                            data
                              ? k.includes('Amount')
                                ? RS.formatMoney(data.systemAmounts[k], 'RM')
                                : data.systemAmounts[k]
                              : '-'
                          }
                        />
                      ))}
                    </DescList>
                  </div>
                </div>
              </RS.CardContent>
            </RS.Card>
            {data?.type === ReconciliationType.BATCH_UPLOAD && data?.posBatchUploadReportId && (
              <ExceptionTxTable exceptionId={data.posBatchUploadReportId} />
            )}
          </>
        )}
      </>
    </div>
  );
};
