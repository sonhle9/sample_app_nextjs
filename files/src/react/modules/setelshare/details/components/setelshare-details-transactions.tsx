import {Card} from '@setel/portal-ui';
import * as React from 'react';
import {SetelShareTransactionsTable} from '../../components/setelshare-transactions-table';
import {useListSetelShareTransactions} from '../../setelshare.queries';

interface Props {
  circleId: string;
}

export const SetelShareDetailsTransactions: React.VFC<Props> = (props) => {
  const {
    query: {data: circleTransactionsResult, isLoading, isFetching},
    pagination,
  } = useListSetelShareTransactions(props.circleId);

  return (
    <Card data-testid="setelshare-details-transactions">
      <Card.Heading title="Transactions" />
      <SetelShareTransactionsTable
        circleTransactionsResult={circleTransactionsResult}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={pagination}
      />
    </Card>
  );
};
