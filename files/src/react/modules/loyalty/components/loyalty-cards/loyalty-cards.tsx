import * as React from 'react';
import {useGetCards} from '../../loyalty.queries';
import {
  Card,
  CardContent,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PaginationNavigation,
  DataTableCaption,
  DropdownSelect,
  FieldContainer,
  DATES,
  DateRangeDropdown,
  Badge,
  formatDate,
  OptionsOrGroups,
  SearchTextInput,
  TextEllipsis,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import {
  CardStatuses,
  CardStatusesName,
  CardIssuers,
  CardIssuersName,
  CardVendorStatuses,
  CardVendorStatusesName,
  CardProvider,
} from '../../loyalty.type';
import {formatISO} from 'date-fns';

const dateOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Yesterday',
    value: formatISO(DATES.yesterday) as string,
  },
  {
    label: 'Last 7 days',
    value: formatISO(DATES.sevenDaysAgo) as string,
  },
  {
    label: 'Last 30 days',
    value: formatISO(DATES.thirtyDaysAgo) as string,
  },
];

export const LoyaltyCards = () => {
  const pagination = usePaginationState();

  const [{values}, {setValueCurry, setValue}] = useFilter({
    status: '',
    vendorStatus: '',
    issuedBy: '',
    cardType: '',
    createdDateFrom: '',
    createdDateTo: '',
    cardNumber: '',
  });

  const {data, isError, isLoading} = useGetCards({
    createdDateFrom: values.createdDateFrom,
    createdDateTo: values.createdDateTo,
    status: values.status as CardStatuses,
    issuedBy: values.issuedBy as CardIssuers,
    vendorStatus: values.vendorStatus as CardVendorStatuses,
    isPhysicalCard:
      values.cardType === 'Physical' ? true : values.cardType === 'Virtual' ? false : null,
    page: pagination.page,
    perPage: pagination.perPage,
    cardNumber: values.cardNumber,
  });

  const statusOptions: OptionsOrGroups<string | CardStatuses> = [{label: 'All', value: ''}].concat(
    Object.values(CardStatuses).map((value) => ({
      label: CardStatusesName.get(value).text,
      value,
    })),
  );

  const cardIssuersOptions: OptionsOrGroups<string | CardIssuers> = [
    {label: 'All', value: ''},
  ].concat(
    Object.values(CardIssuers).map((value) => ({
      label: CardIssuersName.get(value),
      value,
    })),
  );

  const vendorStatusesOptions: OptionsOrGroups<string | CardVendorStatuses> = [
    {label: 'All', value: ''},
  ].concat(
    Object.values(CardVendorStatuses).map((value) => ({
      label: CardVendorStatusesName.get(value).text,
      value,
    })),
  );

  const cardTypeOptions: OptionsOrGroups<string> = [
    {label: 'All', value: ''},
    {label: 'Physical', value: 'Physical'},
    {label: 'Virtual', value: 'Virtual'},
  ];

  return (
    <div className="mb-10 mx-auto px-16 pt-8">
      <TextEllipsis className="flex-grow text-2xl pb-4" text="Loyalty cards " widthClass="w-full" />
      <Card className="mb-4">
        <CardContent>
          <FieldContainer label="Search by loyalty card number">
            <SearchTextInput
              value={values.cardNumber}
              placeholder="Search here ..."
              onChangeValue={setValueCurry('cardNumber')}
              data-testid="search-card"
            />
          </FieldContainer>
          <div className="flex flex-wrap space-x-2">
            <FieldContainer className="w-40" label="Status">
              <DropdownSelect
                value={values.status}
                onChangeValue={setValueCurry('status')}
                options={statusOptions}
                data-testid="select-status"
              />
            </FieldContainer>
            <FieldContainer className="w-40" label="Issued by">
              <DropdownSelect
                value={values.issuedBy}
                onChangeValue={setValueCurry('issuedBy')}
                options={cardIssuersOptions}
                data-testid="select-issuers"
              />
            </FieldContainer>
            <FieldContainer className="w-40" label="Card vendor status">
              <DropdownSelect
                value={values.vendorStatus}
                onChangeValue={setValueCurry('vendorStatus')}
                options={vendorStatusesOptions}
                data-testid="select-vendor-status"
              />
            </FieldContainer>
            <FieldContainer className="w-40" label="Card type">
              <DropdownSelect
                value={values.cardType}
                onChangeValue={setValueCurry('cardType')}
                options={cardTypeOptions}
                data-testid="select-card-type"
              />
            </FieldContainer>
            <div className="min-w-48">
              <DateRangeDropdown
                label="Created date"
                value={[values.createdDateFrom, values.createdDateTo]}
                onChangeValue={(value) => {
                  setValue('createdDateFrom', value[0]);
                  setValue('createdDateTo', value[1]);
                }}
                options={dateOptions}
                disableFuture
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <DataTable
        isLoading={isLoading}
        pagination={
          <PaginationNavigation
            total={data?.metadata.totalCount}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
            variant="prev-next"
          />
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>Card number</Td>
            <Td>User id</Td>
            <Td className="text-center">Status</Td>
            <Td className="text-center">Vendor status</Td>
            <Td>Issued by</Td>
            <Td>Type</Td>
            <Td className="text-right">Created on</Td>
          </Tr>
        </DataTableRowGroup>
        {data?.data?.length === 0 || isError ? (
          <DataTableCaption
            className="text-center py-12 text-mediumgrey text-md"
            data-testid="no-members">
            <p>No transaction found</p>
          </DataTableCaption>
        ) : (
          <DataTableRowGroup>
            {data?.data?.map((card) => (
              <Tr key={card.id}>
                <Td
                  render={(props) => (
                    <a
                      {...props}
                      href={
                        card.provider === CardProvider.SETEL
                          ? `/loyalty/loyalty-cards/${card.cardNumber}`
                          : `/customers/loyalty-cards/${card.id}`
                      }
                      data-testid="card-card-number"
                    />
                  )}
                  className="hover:text-blue-500">
                  {card.cardNumber}
                </Td>
                <Td
                  render={(props) => <a {...props} href={`/customers/${card.userId}`} />}
                  className="hover:text-blue-500">
                  {card.userId}
                </Td>
                <Td className="text-center">
                  <Badge
                    color={CardStatusesName.get(card.status)?.color as any}
                    rounded="rounded"
                    className="uppercase">
                    {CardStatusesName.get(card.status).text}
                  </Badge>
                </Td>
                <Td className="text-center">
                  <Badge
                    color={CardVendorStatusesName.get(card.vendorStatus)?.color as any}
                    rounded="rounded"
                    className="uppercase">
                    {CardVendorStatusesName.get(card.vendorStatus)?.text || card.vendorStatus}
                  </Badge>
                </Td>
                <Td>{CardIssuersName.get(card.issuedBy)}</Td>
                <Td>{card.isPhysicalCard ? 'Physical' : 'Virtual'}</Td>
                <Td className="text-right">
                  {card.createdAt ? formatDate(card.createdAt, {format: 'd MMM yyyy '}) : '-'}
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        )}
      </DataTable>
    </div>
  );
};
