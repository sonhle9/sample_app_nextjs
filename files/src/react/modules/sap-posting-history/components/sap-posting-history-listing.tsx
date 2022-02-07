import {
  Alert,
  DataTableCell as Td,
  DataTableRow as Tr,
  Badge,
  Button,
  DataTable,
  DataTableRowGroup,
  DownloadIcon,
  Filter,
  FilterControls,
  PaginationNavigation,
  titleCase,
  useFilter,
  usePaginationState,
  formatDate,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {getSapPostingHistoryCSV} from 'src/react/services/api-ledger.service';
import {
  glProfile,
  GL_PROFILE_OPTIONS as glProfileConst,
} from '../../general-ledger/general-ledger.constant';
import {useSapPostingHistory} from '../sap-posting-history.queries';

export const SAPPostingHistoryListing = () => {
  const pagination = usePaginationState();

  const filter = useFilter(
    {
      glProfile: GL_PROFILE_OPTIONS[0].value as glProfile,
      range: ['', ''] as [string, string],
    },
    {
      components: [
        {
          key: 'glProfile',
          type: 'select',
          props: {
            options: GL_PROFILE_OPTIONS,
            label: 'GL profile',
          },
        },
        {
          key: 'range',
          type: 'daterange',
          props: {
            customRangeFormatType: 'dateAndTime',
            label: 'Created on',
          },
        },
      ],
    },
  );

  const [{values, applied}, {reset}] = filter;

  const {
    data: resolvedData,
    isLoading,
    isError,
  } = useSapPostingHistory({
    page: pagination.page,
    perPage: pagination.perPage,
    glProfile: values.glProfile,
    range: values.range,
  });

  return (
    <PageContainer
      heading="SAP posting history"
      action={
        <Button
          disabled={resolvedData && resolvedData.isEmpty}
          leftIcon={<DownloadIcon />}
          onClick={async () => {
            const [from, to] = values.range;
            const csvData = await getSapPostingHistoryCSV({to, from, ...values});
            downloadFile(
              csvData,
              `ledger-transaction-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
            );
          }}
          variant="outline">
          DOWNLOAD
        </Button>
      }>
      <div className="my-8 space-y-8">
        <FilterControls filter={filter} />
        {applied.length > 0 && (
          <Filter onReset={reset}>
            {applied.map((item) => (
              <Badge onDismiss={item.resetValue} key={item.prop}>
                {item.label}
              </Badge>
            ))}
          </Filter>
        )}
      </div>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          isLoading={isLoading}
          pagination={
            <PaginationNavigation
              total={resolvedData?.total}
              currentPage={pagination?.page}
              perPage={pagination?.perPage}
              onChangePage={pagination?.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>File name</Td>
              <Td>GL profile</Td>
              <Td>Generation reason</Td>
              <Td className="text-right">Posting date</Td>
              <Td className="text-right">Created on</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((posting) => (
                <Tr
                  key={posting.id}
                  render={(props) => (
                    <Link
                      to={`/sap-posting-history/${posting.id}`}
                      data-testid="sap-posting-history-record"
                      {...props}
                    />
                  )}>
                  <Td>{posting.fileName}</Td>
                  <Td>{posting.glProfile}</Td>
                  <Td>{posting.generationTrigger}</Td>
                  <Td className="text-right">
                    {formatDate(posting.postingDate, {formatType: 'dateOnly'})}
                  </Td>
                  <Td className="text-right">
                    {formatDate(posting.createdAt, {formatType: 'dateAndTime'})}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const GL_PROFILE_OPTIONS = [
  {
    label: 'Any profile',
    value: '',
  },
].concat(
  Object.keys(glProfileConst).map((key) => ({
    label: titleCase(glProfileConst[key], {hasUnderscore: true}),
    value: glProfileConst[key],
  })),
);
