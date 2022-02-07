import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useGetSetelShareDetails} from '../setelshare.queries';
import {SetelShareDetailsGeneral} from './components/setelshare-details-general';
import {SetelShareDetailsMembers} from './components/setelshare-details-members';
import {SetelShareDetailsTransactions} from './components/setelshare-details-transactions';

interface Props {
  id: string;
}

export const SetelShareDetails: React.VFC<Props> = (props) => {
  const {data, isLoading, isError} = useGetSetelShareDetails(props.id);

  return (
    <PageContainer heading="Setel Share Details" data-testid="setelshare-details">
      <div className="space-y-5">
        <SetelShareDetailsGeneral circleDetails={data} isLoading={isLoading} />
        <SetelShareDetailsMembers circleDetails={data} isLoading={isLoading} isError={isError} />
        <SetelShareDetailsTransactions circleId={props.id} />
      </div>
    </PageContainer>
  );
};
