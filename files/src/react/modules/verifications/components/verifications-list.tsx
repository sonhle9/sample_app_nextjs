import {
  Alert,
  Badge,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
  titleCase,
  useFilter,
  usePaginationState,
  ExternalIcon,
  IconButton,
  Text,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {useRouter} from 'src/react/routing/routing.context';
import {
  Classification,
  ClassificationValues,
  IVerification,
  VerificationStatus,
  VerificationStatusValues,
} from 'src/shared/interfaces/verifications.interface';
import {useVerifications} from '../verifications.queries';

export const VerificationsListing = () => {
  const router = useRouter();
  const filter = useFilter(
    {
      verificationStatus: STATUS_OPTIONS[0].value as VerificationStatus,
      classification: CLASSIFICATION_OPTIONS[0].value as Classification,
      range: ['', ''] as [string, string],
      searchKey: '',
    },
    {
      components: [
        {
          key: 'verificationStatus',
          type: 'select',
          props: {
            options: STATUS_OPTIONS,
            label: 'Status',
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
        {
          key: 'searchKey',
          type: 'search',
          props: {
            label: 'Search',
            placeholder: 'Enter name, ID number or account ID',
            'data-testid': 'textbox',
            wrapperClass: '2xl:col-span-3 md:col-span-2',
          },
        },
      ],
    },
  );

  const [{values}] = filter;

  const pagination = usePaginationState();
  const {
    data: resolvedData,
    isLoading,
    isError,
  } = useVerifications({
    page: pagination.page,
    perPage: pagination.perPage,
    ...values,
  });

  return (
    <PageContainer heading="Verifications">
      <div className="my-8 space-y-8">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
      </div>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          isLoading={isLoading}
          pagination={
            resolvedData && (
              <PaginationNavigation
                total={resolvedData.total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Customer Name</Td>
              <Td>Account Id</Td>
              <Td>Status</Td>
              <Td>Type</Td>
              <Td className="text-right">Created on</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((parameter) => (
                <Tr
                  key={parameter.id}
                  render={(props) => (
                    <Link
                      to={`/verifications/${parameter.id}?accountId=${parameter.customerId}`}
                      data-testid="verifications-record"
                      {...props}
                    />
                  )}>
                  <Td>
                    {parameter.fullName}
                    <br />
                    <Text className="text-lightgrey text-sm">{parameter.idNumber}</Text>
                  </Td>
                  <Td className="flex items-center">
                    {parameter.customerId}
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.navigate(['/customers/' + parameter.customerId], {
                          queryParams: {tabIndex: 1},
                        });
                      }}>
                      <ExternalIcon color="#00b0ff" />
                    </IconButton>
                  </Td>
                  <Td>
                    <Badge rounded={'rounded'} color={statusColorMap[parameter.verificationStatus]}>
                      {parameter.verificationStatus}
                    </Badge>
                  </Td>
                  <Td>ID Verification</Td>
                  <Td className="text-right">
                    {formatDate(parameter.createdAt, {formatType: 'dateAndTime'})}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const statusColorMap: Record<IVerification['verificationStatus'], any> = {
  PENDING: 'lemon',
  APPROVED: 'success',
  REJECTED: 'error',
};

const STATUS_OPTIONS = [
  {
    label: 'All statuses',
    value: '',
  },
].concat(
  Object.keys(VerificationStatusValues).map((key) => ({
    label: titleCase(VerificationStatusValues[key]),
    value: VerificationStatusValues[key],
  })),
);

const CLASSIFICATION_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
].concat(
  Object.keys(ClassificationValues).map((key) => ({
    label: titleCase(ClassificationValues[key], {hasUnderscore: true}),
    value: ClassificationValues[key],
  })),
);
