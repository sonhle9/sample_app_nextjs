import {
  Button,
  DataTable as Table,
  DownloadIcon,
  DropdownSelect,
  FieldContainer,
  Filter,
  FilterControls,
  MultiInput,
  PaginationNavigation,
  SearchTextInput,
} from '@setel/portal-ui';
import * as React from 'react';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {listLeaderboard} from 'src/react/services/api-rewards.service';
import {downloadTextFile} from '../../store-orders/store-orders.helpers';
import {useDownloadReferralLeaderboard} from '../rewards.queries';

export function ReferralLeaderboardListing() {
  const {
    query: {isLoading, data, isFetching},
    pagination,
    filter,
  } = useDataTableState({
    queryFn: (params) => listLeaderboard({...params, tags: params.tags.join(',')}),
    queryKey: 'leaderboard',
    initialFilter: {
      tags: [] as string[],
      referralCode: '',
      referrerCode: '',
    },
    components: [
      {
        key: 'referralCode',
        type: 'search',
        props: {
          label: 'Referral Code',
          placeholder: 'Referral Code',
        },
      },

      {
        key: 'referrerCode',
        type: 'search',
        props: {
          label: 'Referrer Code',
          placeholder: 'Referrer Code',
        },
      },

      {
        key: 'tags',
        type: 'multiinput',
        props: {
          label: 'Tags',
          placeholder: 'Tags',
        },
      },
    ],
    keepPreviousData: true,
  });

  const [searchBy, setSearchBy] = React.useState('tags');
  const {mutate: downloadCsv, isLoading: isDownloading} = useDownloadReferralLeaderboard();

  React.useEffect(() => {
    filter[1].reset();
  }, [searchBy]);

  const RenderSearchByInput = () => {
    return (
      <>
        {searchBy === 'referrerCode' && (
          <FieldContainer className="col-span-2" label="Referrer Code">
            <SearchTextInput
              value={filter[0].values.referrerCode}
              onChangeValue={filter[1].setValueCurry('referrerCode')}
            />
          </FieldContainer>
        )}
        {searchBy === 'referralCode' && (
          <FieldContainer className="col-span-2" label="Referral Code">
            <SearchTextInput
              data-testid="referral-code-input"
              value={filter[0].values.referralCode}
              onChangeValue={filter[1].setValueCurry('referralCode')}
            />
          </FieldContainer>
        )}
        {searchBy === 'tags' && (
          <FieldContainer className="col-span-2" label="Tags">
            <MultiInput
              values={filter[0].values.tags}
              data-testid="tags-input"
              onChangeValues={filter[1].setValueCurry('tags')}
            />
          </FieldContainer>
        )}
      </>
    );
  };
  return (
    <PageContainer
      heading="Referral leaderboard"
      action={
        <Button
          variant="outline"
          leftIcon={<DownloadIcon />}
          disabled={isDownloading}
          isLoading={isDownloading}
          onClick={() =>
            downloadCsv(
              {
                ...filter[0].values,
                tags: filter[0].values.tags.join(','),
              },
              {onSuccess: (value) => downloadTextFile(value, 'leaderboard.csv')},
            )
          }>
          DOWNLOAD CSV
        </Button>
      }>
      <div className="space-y-5">
        <FilterControls data-testid="filter-control">
          <FieldContainer data-testid="search-by-dropdown" label="Search by" layout="vertical">
            <DropdownSelect
              value={searchBy}
              onChangeValue={(value) => setSearchBy(value)}
              options={searchOptions}
              data-testid="filter-type-dropdown"
            />
          </FieldContainer>
          <RenderSearchByInput />
        </FilterControls>
        <Filter filter={filter}></Filter>
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data && (
              <PaginationNavigation
                total={data.total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Tags</Table.Th>
              <Table.Th>Referral Code</Table.Th>
              <Table.Th>Referrer Code</Table.Th>
              <Table.Th>Registered Referrals</Table.Th>
              <Table.Th>Successful Referrals</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {!isLoading &&
            data &&
            (data.total ? (
              <Table.Tbody>
                {data.data.map((member) => (
                  <Table.Tr
                    key={member?.id}
                    render={(props) => (
                      <Link
                        data-testid={`leaderboard-table-row-${member?.id}`}
                        {...props}
                        to={`/accounts/${member?.user?.id}`}></Link>
                    )}>
                    <Table.Td className="max-w-sm">{member?.user?.fullName}</Table.Td>
                    <Table.Td>
                      {!!member?.user?.profile?.tags.length &&
                        member?.user?.profile.tags.join(', ')}
                    </Table.Td>
                    <Table.Td>{member?.referralCode}</Table.Td>
                    <Table.Td>{member?.referrerCode}</Table.Td>
                    <Table.Td>{member?.referralStat?.registered}</Table.Td>
                    <Table.Td>{member?.referralStat?.purchased}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            ) : (
              <EmptyDataTableCaption />
            ))}
        </Table>
      </div>
    </PageContainer>
  );
}

const searchOptions = [
  {
    label: 'Tags',
    value: 'tags',
  },
  {
    label: 'Referrer code',
    value: 'referrerCode',
  },
  {
    label: 'Referral code',
    value: 'referralCode',
  },
];
