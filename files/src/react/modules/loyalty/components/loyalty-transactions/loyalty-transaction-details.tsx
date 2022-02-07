import * as React from 'react';
import {useGetTransactionById} from '../../loyalty.queries';
import {TextEllipsis, JsonPanel} from '@setel/portal-ui';

type LoyaltyTransactionDetailsProps = {
  id: string;
};

type JSONObject = {[key: string]: string | string[]};

export const LoyaltyTransactionDetails: React.VFC<LoyaltyTransactionDetailsProps> = ({id}) => {
  const {data} = useGetTransactionById(id);

  const dataObject = data as unknown as JSONObject;

  return (
    <div className="mx-auto px-16">
      <div className="mb-10 pt-8">
        <TextEllipsis
          className="flex-grow text-2xl pb-4"
          text="Loyalty transactions"
          widthClass="w-full"
        />
        <JsonPanel defaultOpen allowToggleFormat defaultIsPretty json={dataObject} />
      </div>
    </div>
  );
};
