import {
  Button,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  formatDate,
  PaginationNavigation,
  PlusIcon,
  Filter,
  FilterControls,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {CompanyModalMessage} from '../../../../shared/enums/company.enum';
import {useNotification} from '../../../hooks/use-notification';
import {useGetCompanyType} from '../companies.queries';
import {getCompanies} from '../companies.service';
import {CompanyDetailsModal} from './company-details-modal';

export const CompanyListing = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const {data: companyTypes} = useGetCompanyType({
    perPage: 999,
  });

  const setNotification = useNotification();
  const companyTypeOptions = companyTypes
    ? companyTypes.map((types) => {
        return {
          label: types.name,
          value: types.code,
        };
      })
    : [];

  const {
    pagination,
    filter,
    query: {data, isLoading, isFetching},
  } = useDataTableState({
    initialFilter: {
      keyWord: '',
      companyType: '',
    },
    queryKey: 'companies',
    queryFn: ({keyWord, companyType, page, perPage}) =>
      getCompanies({
        page,
        perPage,
        keyWord,
        companyType,
      }),
    components: [
      {
        key: 'companyType',
        type: 'select',
        props: {
          label: 'Type',
          options: [
            {
              label: 'Any types',
              value: '',
            },
            {
              label: 'No type',
              value: 'null',
            },
            ...companyTypeOptions,
          ],
        },
      },
      {
        key: 'keyWord',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Search for name',
          wrapperClass: 'lg:col-span-2',
        },
      },
    ],
    keepPreviousData: true,
  });

  return (
    <>
      <PageContainer
        heading="Companies"
        action={
          <Button variant="primary" onClick={() => setVisibleModal(true)} leftIcon={<PlusIcon />}>
            CREATE
          </Button>
        }>
        <div className="space-y-8">
          <FilterControls filter={filter} />
          <Filter filter={filter} />
          <DataTable
            isLoading={isLoading}
            isFetching={isFetching}
            pagination={
              data &&
              !!data.companies.length && (
                <PaginationNavigation
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  total={data.totalDocs}
                  onChangePage={pagination.setPage}
                  onChangePageSize={pagination.setPerPage}
                />
              )
            }>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>Company name</Td>
                <Td>Type</Td>
                <Td className="text-right">Created On</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {data &&
                data.companies.map((company) => (
                  <Tr
                    render={(props) => <Link {...props} to={`/companies/${company.id}`} />}
                    key={company._id}>
                    <Td className="break-all">{company.name}</Td>
                    <Td className="break-all">{company.companyType?.name}</Td>
                    <Td className="text-right">
                      {formatDate(company.createdAt, {
                        formatType: 'dateAndTime',
                      })}
                    </Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
            {data && !data.companies.length && (
              <DataTableCaption>
                <div className="flex items-center justify-center py-24">
                  <p>No company found.</p>
                </div>
              </DataTableCaption>
            )}
          </DataTable>
        </div>
      </PageContainer>
      {visibleModal && (
        <CompanyDetailsModal
          onClose={(message) => {
            setVisibleModal(false);
            message === CompanyModalMessage.SUCCESS &&
              setNotification({
                title: 'Successful!',
                variant: 'success',
                description: 'Company has been created.',
              });
          }}
        />
      )}
    </>
  );
};
