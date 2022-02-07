import {
  Button,
  Card,
  CardContent,
  CardHeading,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DescItem,
  DescList,
  EditIcon,
  Filter,
  FilterControls,
  formatMoney,
  JsonPanel,
  PaginationNavigation,
  Skeleton,
} from '@setel/portal-ui';
import moment from 'moment';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {CompanyModalMessage, CompanyTypeCodes} from '../../../../shared/enums/company.enum';
import {Switch} from '../../../components/switch';
import {useNotification} from '../../../hooks/use-notification';
import {extractErrorWithConstraints} from '../../../lib/utils';
import {
  companyQueryKey,
  useGetEnabledProductMerchants,
  useGetProductsEnterprise,
  useSetCompany,
  useUpdateProductOfferingsCompany,
} from '../companies.queries';
import {ICompany} from '../companies.type';
import {CompanyConfirmProductModal} from './company-confirm-product-modal';
import {CompanyDetailsModal} from './company-details-modal';
import {CompanyMerchantsDetail} from './company-merchants-detail';
import {useDataTableState} from '../../../hooks/use-state-with-query-params';
import {getListMerchantCompany} from '../companies.service';
import {QueryErrorAlert} from '../../../components/query-error-alert';

interface ICompanyDetailsProps {
  id: string;
  company: ICompany;
}

export const CompanyGeneralDetails = (props: ICompanyDetailsProps) => {
  const {company} = props;
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [visibleModalMerchant, setVisibleModalMerchant] = React.useState(false);
  const setNotification = useNotification();
  const [jsonString, setJsonString] = React.useState({});
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [product, setProduct] = React.useState();
  const {mutate: setCompany} = useSetCompany(company);
  const getProductOfferingsEnterprise = useGetProductsEnterprise();
  const updateProductOfferingsCompany = useUpdateProductOfferingsCompany();
  const getEnabledProductMerchants = useGetEnabledProductMerchants();

  const {
    query: {isLoading, isFetching, data: merchants, error},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      searchValue: '',
    },
    queryKey: `${companyQueryKey.COMPANY_MERCHANTS}_${props.id}`,
    queryFn: (filter) =>
      getListMerchantCompany({
        ...filter,
        searchValue: filter.searchValue?.trim() ? filter.searchValue.trim() : undefined,
        companyId: props.id,
      }),
    components: [
      {
        key: 'searchValue',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Enter merchant name or merchant ID',
          wrapperClass: 'col-span-2',
        },
      },
    ],
  });

  const rowClasses =
    'table-cell px-4 sm:first:pl-7 sm:last:pr-7 whitespace-no-wrap text-sm font-normal leading-snug';
  const data = {
    productOfferings: {
      retailEnabled: true,
    },
  };

  React.useEffect(() => {
    if (
      company &&
      (!company.manageCatalogue ||
        (company.manageCatalogue !== 'merchant_managed' &&
          company.manageCatalogue !== 'company_managed'))
    ) {
      if (setCompany) {
        setCompany({
          ...company,
          manageCatalogue: 'merchant_managed',
        });
      }
    }
  }, [company, setCompany]);

  const handleUpdateProductCompany = async (product: string, enable: boolean) => {
    try {
      await updateProductOfferingsCompany.mutateAsync({
        company: props.id,
        product,
        enable,
      });
    } catch (err) {
      setNotification({
        title: 'Failed!',
        variant: 'error',
        description: extractErrorWithConstraints(err),
      });
    }
    setShowConfirmModal(false);
  };

  const handleProductOfferingChange = async (product, isChecked) => {
    setProduct(product);
    if (isChecked) {
      try {
        const productsEnterprise = await getProductOfferingsEnterprise.mutateAsync();
        if (productsEnterprise.products[product]) {
          await handleUpdateProductCompany(product, true);
        } else {
          setNotification({
            title: 'Failed!',
            variant: 'error',
            description: 'This product at enterprise level needs to be turned on first',
          });
        }
      } catch (err) {
        setNotification({
          title: 'Failed!',
          variant: 'error',
          description: extractErrorWithConstraints(err),
        });
      }
    } else {
      try {
        const enabledProductMerchants = await getEnabledProductMerchants.mutateAsync({
          company: props.id,
          product: `${product}Enabled`,
        });
        if (enabledProductMerchants.merchants > 0) {
          setShowConfirmModal(true);
        } else {
          await handleUpdateProductCompany(product, false);
        }
      } catch (err) {
        setNotification({
          title: 'Failed!',
          variant: 'error',
          description: extractErrorWithConstraints(err),
        });
      }
    }
  };

  React.useEffect(() => {
    setJsonString({
      ...company,
      merchants: (merchants?.items || []).map((i) => i.name),
    });
  }, [company, merchants]);

  const showSmartpayFields = company && company.companyType?.code === CompanyTypeCodes.SMARTPAY;

  return (
    <>
      <PageContainer heading="Company details">
        <div className="space-y-8">
          <Card>
            <CardHeading title="General">
              <Button
                data-testid={'edit-company-general-btn'}
                variant="outline"
                onClick={() => setVisibleModal(true)}
                leftIcon={<EditIcon />}>
                EDIT
              </Button>
            </CardHeading>
            <CardContent>
              <DescList>
                <DescItem
                  label={'Logo'}
                  value={
                    company?.logo && (
                      <img
                        style={{backgroundColor: company.logoBackgroundColor || 'transparent'}}
                        src={company.logo}
                        alt="logo"
                        className="w-16 lg:w-24 h-auto"
                      />
                    )
                  }
                />
                <DescItem
                  label={'Logo background color'}
                  value={
                    <div className={'flex flex-row'}>
                      {company?.logoBackgroundColor && (
                        <div
                          className={'w-4 h-4 rounded my-auto mr-2'}
                          style={{backgroundColor: company?.logoBackgroundColor}}
                        />
                      )}
                      <span>{company?.logoBackgroundColor || '-'}</span>
                    </div>
                  }
                />
                <DescItem
                  label={'Apply logo to child merchants'}
                  value={company?.isApplyLogoToChildMerchant ? 'Yes' : 'No'}
                />
                <DescItem label="Type" value={(company && company.companyType?.name) || '-'} />
                {showSmartpayFields && <DescItem label="Code" value={company && company.code} />}
                <DescItem label="Name" value={company && company.name} />
                {showSmartpayFields && (
                  <>
                    <DescItem
                      label="Credit limit sharing"
                      value={company.creditLimitSharing ? 'Yes' : 'No'}
                    />
                    <DescItem
                      label="Credit limit"
                      value={company?.creditLimit ? `RM ${formatMoney(company.creditLimit)}` : '-'}
                    />
                  </>
                )}
                <DescItem
                  label="Manage catalogue"
                  value={
                    company && company.manageCatalogue === 'company_managed'
                      ? 'Company managed'
                      : 'Merchant managed'
                  }
                />
                {showSmartpayFields && (
                  <DescItem
                    label="Authorised signatory"
                    value={(company && company.authorisedSignatory) || '-'}
                  />
                )}
                <DescItem
                  label="Created on"
                  value={moment(company && company.createdAt).format('DD MMMM YYYY')}
                />
              </DescList>
            </CardContent>
          </Card>
          <Card expandable defaultIsOpen>
            <Card.Heading title={'Merchants'}>
              <Button
                variant="outline"
                onClick={() => setVisibleModalMerchant(true)}
                leftIcon={<EditIcon />}>
                EDIT
              </Button>
            </Card.Heading>
            <Card.Content className={'p-0'}>
              <div>
                <FilterControls className={'px-7 rounded-none'} filter={filter} />
                <Filter className={'px-7 py-4'} filter={filter} />
                {error && !isLoading && <QueryErrorAlert error={error as any} />}
                <DataTable
                  isLoading={isLoading}
                  isFetching={isFetching}
                  pagination={
                    !!merchants?.items?.length && (
                      <PaginationNavigation
                        currentPage={pagination.page}
                        perPage={pagination.perPage}
                        total={merchants.total}
                        onChangePage={pagination.setPage}
                        onChangePageSize={pagination.setPerPage}
                      />
                    )
                  }>
                  <DataTableRowGroup groupType="thead">
                    <Tr>
                      <Td className={'pl-7'}>Merchant name</Td>
                    </Tr>
                  </DataTableRowGroup>
                  <DataTableRowGroup>
                    {(merchants?.items || []).map((merchant) => (
                      <Tr key={merchant.id}>
                        <Td className={'pl-7'}>{merchant.name}</Td>
                      </Tr>
                    ))}
                  </DataTableRowGroup>
                  {merchants && !merchants.items?.length && (
                    <DataTableCaption>
                      <div className="flex items-center justify-center py-16">
                        <p>No Merchants linked yet.</p>
                      </div>
                    </DataTableCaption>
                  )}
                </DataTable>
              </div>
            </Card.Content>
          </Card>
          <div className="my-0">
            <DataTable heading={<CardHeading title="Product offerings" />}>
              <DataTableRowGroup>
                {PRODUCTS.map((product, idx) => (
                  <Tr key={idx}>
                    <div className={rowClasses}>
                      {data ? (
                        <Switch
                          label={product.label}
                          on={!!(company && company.products && company.products[product.value])}
                          onChangeValue={(isChecked) =>
                            handleProductOfferingChange(product.value, isChecked)
                          }
                          wrapperClass="px-2 font-normal text-black"
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </div>
                  </Tr>
                ))}
              </DataTableRowGroup>
            </DataTable>
          </div>
          <JsonPanel json={jsonString} />
        </div>
      </PageContainer>
      {visibleModal && (
        <CompanyDetailsModal
          onClose={(message, err) => {
            setVisibleModal(false);
            [CompanyModalMessage.SUCCESS, CompanyModalMessage.DELETE_SUCCESS].includes(message) &&
              setNotification({
                title: 'Successful!',
                variant: 'success',
                description:
                  message === CompanyModalMessage.SUCCESS
                    ? 'Company details has been updated.'
                    : 'Company has been deleted.',
              });
            CompanyModalMessage.DELETE_ERROR &&
              !!err &&
              setNotification({
                title: 'Failed!',
                variant: 'error',
                description: (err.response && err.response.data) || err.message,
              });
          }}
          company={company}
          merchants={merchants}
        />
      )}
      {visibleModalMerchant && (
        <CompanyMerchantsDetail
          visible={visibleModalMerchant}
          onClose={() => setVisibleModalMerchant(false)}
          merchants={merchants.items}
          idCompany={props.id}
          nameCompany={company && company.name}
          productsCompany={company.products}
        />
      )}
      {showConfirmModal && (
        <CompanyConfirmProductModal
          companyId={props.id}
          showModal={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => handleUpdateProductCompany(product, false)}
        />
      )}
    </>
  );
};

const PRODUCTS = [
  {
    label: 'Retail',
    value: 'retail',
  },
  {
    label: 'Fulfilment',
    value: 'fulfillment',
  },
  {
    label: 'Fuelling',
    value: 'fuelling',
  },
  {
    label: 'Catalogue',
    value: 'catalogue',
  },
  {
    label: 'Point of sale',
    value: 'pointOfSale',
  },
  {
    label: 'eCommerce',
    value: 'eCommerce',
  },
  {
    label: 'Inventory',
    value: 'inventory',
  },
  {
    label: 'Shipping',
    value: 'shipping',
  },
  {
    label: 'Timesheet',
    value: 'timesheet',
  },
  {
    label: 'Loyalty',
    value: 'loyalty',
  },
  {
    label: 'Deals',
    value: 'deals',
  },
  {
    label: 'Gifts',
    value: 'gifts',
  },
  {
    label: 'Vehicles',
    value: 'vehicles',
  },
  {
    label: 'Payments',
    value: 'payments',
  },
  {
    label: 'Billing',
    value: 'billing',
  },
  {
    label: 'Bills & reloads',
    value: 'billsReloads',
  },
  {
    label: 'Card issuing',
    value: 'cardIssuing',
  },
  {
    label: 'Payment controller',
    value: 'paymentController',
  },
  {
    label: 'Developer',
    value: 'developer',
  },
  {
    label: 'Pricing',
    value: 'pricing',
  },
  {
    label: 'Drop-in',
    value: 'dropIn',
  },
  {
    label: 'Mini',
    value: 'mini',
  },
  {
    label: 'Checkout',
    value: 'checkout',
  },
];
