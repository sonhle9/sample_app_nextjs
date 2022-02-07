import * as RS from '@setel/portal-ui';
import {format} from 'date-fns';
import * as React from 'react';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {PageContainer} from 'src/react/components/page-container';
import {dealRole} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../auth/HasPermission';
import {TokenPagination, usePaginationByToken} from '../tokenPagination';
import {DealCampaignItemActions} from './DealCampaignItemActions';
import {listDeals} from './deals.service';
import {DealSearch} from './DealSearch';
import {DealStatus} from './DealStatus';

export const DealCampaignsList: React.VFC = () => {
  const [search, setSearch] = React.useState({name: ''});
  const [tokens, setTokens] = React.useState<string[]>([]);
  const {perPage, setPerPage} = RS.usePaginationState();
  const {
    data: latestData,
    next,
    prev,
    isFetching,
  } = usePaginationByToken({
    key: 'deals',
    params: {...search, perPage},
    queryFn: listDeals,
    tokens,
    onTokensChange: setTokens,
  });

  const onSearch = (params) => {
    setSearch(params);
    setTokens([]);
  };

  return (
    <PageContainer heading="Deal campaign">
      <DealSearch className="mb-6" search={search} isFetching={isFetching} onSearch={onSearch} />
      <RS.DataTable
        isLoading={isFetching}
        pagination={
          latestData && (
            <TokenPagination
              tokens={tokens}
              perPage={perPage}
              setPerPage={setPerPage}
              next={next}
              prev={prev}
              total={latestData.total}
            />
          )
        }>
        <RS.DataTableRowGroup groupType="thead">
          <RS.DataTableRow>
            <RS.DataTableCell>DEAL CAMPAIGN NAME</RS.DataTableCell>
            <RS.DataTableCell>STATUS</RS.DataTableCell>
            <RS.DataTableCell>MERCHANT</RS.DataTableCell>
            <RS.DataTableCell>LAUNCHED DATE</RS.DataTableCell>
            <RS.DataTableCell>END DATE</RS.DataTableCell>
            <RS.DataTableCell> </RS.DataTableCell>
          </RS.DataTableRow>
        </RS.DataTableRowGroup>
        <RS.DataTableRowGroup>
          {latestData?.data.map(
            ({_id, name, status, startDate, endDate, merchantId, voucherBatch}) => (
              <RS.DataTableRow key={_id}>
                <RS.DataTableCell
                  onClick={() => {
                    window.open(
                      `${CURRENT_ENTERPRISE.dashboardUrl}/deal/campaigns/${_id}?merchantId=${merchantId}`,
                      '_blank',
                    );
                  }}>
                  <RS.TextEllipsis widthClass="max-w-xs cursor-pointer" text={name || '-'} />
                </RS.DataTableCell>
                <RS.DataTableCell>
                  <DealStatus status={status} />
                </RS.DataTableCell>
                <RS.DataTableCell>{voucherBatch?.merchant?.name || '-'}</RS.DataTableCell>
                <RS.DataTableCell>
                  {startDate ? format(new Date(startDate), 'dd MMM yyyy') : '-'}
                </RS.DataTableCell>
                <RS.DataTableCell>
                  {endDate ? format(new Date(endDate), 'dd MMM yyyy') : '-'}
                </RS.DataTableCell>
                <RS.DataTableCell>
                  <HasPermission accessWith={[dealRole.admin_deals_deal_campaign_approve]}>
                    <DealCampaignItemActions dealId={_id} status={status} />
                  </HasPermission>
                </RS.DataTableCell>
              </RS.DataTableRow>
            ),
          )}
        </RS.DataTableRowGroup>
      </RS.DataTable>
    </PageContainer>
  );
};
