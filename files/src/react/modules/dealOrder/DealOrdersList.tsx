import * as React from 'react';
import {useMutation} from 'react-query';
import {format} from 'date-fns';
import * as RS from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {DownloadCsvDropdown} from '../../components/download-csv-dropdown';
import {TokenPagination, usePaginationByToken} from '../tokenPagination';
import {listDealOrders, downloadOrdersReport, sendReportViaEmails} from './dealOrder.service';
import {DealOrderStatus} from './DealOrderStatus';
import {DealOrderStatus as DealOrderStatusEnum} from './dealOrder.type';

export const DealOrderList: React.VFC = () => {
  const [tokens, setTokens] = React.useState<string[]>([]);

  const [params, setParams] = React.useState({
    search: '',
    status: '',
    fromDate: '',
    toDate: '',
  });
  const {perPage, setPerPage} = RS.usePaginationState();

  const {
    data: latestData,
    next,
    prev,
    isFetching,
  } = usePaginationByToken({
    key: 'dealOrders',
    queryFn: listDealOrders,
    tokens,
    params: {
      ...params,
      select: 'profiles',
      perPage,
    },
    onTokensChange: setTokens,
  });
  const {mutate: downloadReport, isLoading: isDownloading} = useMutation(() =>
    downloadOrdersReport(params),
  );

  const onSearch = (update) => {
    setParams((p) => ({...p, ...update}));
    setTokens([]);
  };

  return (
    <PageContainer
      heading="Deal orders"
      action={
        <DownloadCsvDropdown
          isDownloading={isDownloading}
          onDownload={() => downloadReport()}
          onSendEmail={(emails) => sendReportViaEmails({emails, params})}
        />
      }>
      <div className="pb-6">
        <RS.Card className="overflow-visible">
          <div className="flex p-4">
            <RS.Field className="p-2 w-4/12">
              <RS.Label className="text-sm">
                <RS.Text color="lightgrey">Status</RS.Text>
              </RS.Label>
              <RS.DropdownSelect
                value={params.status}
                placeholder="All status"
                onChangeValue={(status) => onSearch({status})}
                options={[
                  {
                    label: 'All',
                    value: '',
                  },
                  ...Object.values(DealOrderStatusEnum).map((value) => ({
                    label: value.replace('_', ' '),
                    value,
                  })),
                ]}
              />
            </RS.Field>
            <RS.Field className="p-2 w-4/12">
              <RS.Label className="text-sm">
                <RS.Text color="lightgrey">Redeemed date</RS.Text>
              </RS.Label>
              <RS.DateRangeDropdown
                value={[params.fromDate, params.toDate]}
                onChangeValue={(value) => {
                  onSearch({fromDate: value[0], toDate: value[1]});
                }}
                dayOnly
              />
            </RS.Field>
            <RS.Field className="p-2 w-4/12">
              <RS.Label className="text-sm">
                <RS.Text color="lightgrey">Search</RS.Text>
              </RS.Label>
              <div className="relative">
                <RS.SearchTextInput
                  value={params.search}
                  onChangeValue={(search) => onSearch({search})}
                  placeholder="Search..."
                />
              </div>
            </RS.Field>
          </div>
        </RS.Card>
      </div>

      <RS.DataTable
        isLoading={isFetching}
        pagination={
          latestData && (
            <TokenPagination
              tokens={tokens}
              perPage={perPage}
              next={next}
              prev={prev}
              total={latestData.total}
              setPerPage={setPerPage}
            />
          )
        }>
        <RS.DataTableRowGroup groupType="thead">
          <RS.DataTableRow>
            <RS.DataTableCell>DEAL ORDER ID</RS.DataTableCell>
            <RS.DataTableCell>DEAL CAMPAIGN ID</RS.DataTableCell>
            <RS.DataTableCell>DEAL DISPLAY NAME</RS.DataTableCell>
            <RS.DataTableCell>STATUS</RS.DataTableCell>
            <RS.DataTableCell>CUSTOMER</RS.DataTableCell>
            <RS.DataTableCell>REDEEMED ON</RS.DataTableCell>
          </RS.DataTableRow>
        </RS.DataTableRowGroup>
        <RS.DataTableRowGroup>
          {latestData?.data.map(({_id, deal, status, timestamps, merchantId, profile}) => (
            <RS.DataTableRow
              key={_id}
              className="cursor-pointer"
              onClick={() => {
                window.open(
                  `${CURRENT_ENTERPRISE.dashboardUrl}/deal/orders/${_id}?merchantId=${merchantId}`,
                  '_blank',
                );
              }}>
              <RS.DataTableCell>
                <RS.TextEllipsis widthClass="max-w-xss" text={_id} />
              </RS.DataTableCell>
              <RS.DataTableCell>
                <RS.TextEllipsis widthClass="max-w-xss" text={deal._id} />
              </RS.DataTableCell>
              <RS.DataTableCell>
                <RS.TextEllipsis widthClass="max-w-xss" text={deal.name} />
              </RS.DataTableCell>
              <RS.DataTableCell>
                <DealOrderStatus status={status} />
              </RS.DataTableCell>
              <RS.DataTableCell>
                <RS.TextEllipsis widthClass="max-w-xss" text={profile?.fullName} />
              </RS.DataTableCell>
              <RS.DataTableCell>
                {timestamps.CLAIMED ? format(new Date(timestamps.CLAIMED), 'dd MMM yyyy') : '-'}
              </RS.DataTableCell>
            </RS.DataTableRow>
          ))}
        </RS.DataTableRowGroup>
      </RS.DataTable>
    </PageContainer>
  );
};
