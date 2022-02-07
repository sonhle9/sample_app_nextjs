import {
  Badge,
  Button,
  DataTable as Table,
  Filter,
  FilterControls,
  formatMoney,
  PaginationNavigation,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {Link} from 'src/react/routing/link';
import {PageContainer} from 'src/react/components/page-container';
import {
  PlanType,
  Country,
  Currency,
  PlanStatus,
  PlanStructure,
} from 'src/react/modules/bnpl-plan-config/bnpl.enum';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {bnplPlanQueryKey} from '../bnpl-plan.queries';
import {getBnplPlans} from 'src/react/services/api-bnpl.service';
import {useBnplPlanConfigDetailModal} from './modals/plan-config-detail-modal';
import {GetBnplPlanOptions, IPlan} from 'src/react/modules/bnpl-plan-config/bnpl.interface';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {
  statusOptions,
  planTypeOptions,
  currencyOptions,
  countryOptions,
  amountOptions,
  planStructureOptions,
  statusColor,
} from '../bnpl-plan.constant';
import {adminBnplPlanConfig} from 'src/shared/helpers/roles.type';

export const BNPLPlanListing = () => {
  const {
    query: {data, isLoading, isFetching},
    pagination,
    filter,
  } = useDataTableState({
    initialFilter: {
      status: '',
      planType: '',
      currencyCode: Currency.MYR,
      country: Country.MALAYSIA,
      amount: '',
      planStructure: '' as any,
    } as unknown as FilterValues,
    queryKey: bnplPlanQueryKey.planListing,
    queryFn: (values) => getBnplPlans(transformToApiFilter(values)),
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          wrapperClass: 'col-span-1',
          options: [{label: 'All status', value: ''}, ...statusOptions],
          placeholder: 'All status',
        },
      },
      {
        key: 'instructionInterval',
        type: 'select',
        props: {
          label: 'Plan Type',
          wrapperClass: 'col-span-1',
          options: [{label: 'All plan type', value: ''}, ...planTypeOptions],
          placeholder: 'All plan type',
        },
      },
      {
        key: 'currencyCode',
        type: 'select',
        props: {
          label: 'Currency',
          wrapperClass: 'col-span-1',
          options: currencyOptions,
          placeholder: 'All currency',
        },
      },
      {
        key: 'country',
        type: 'select',
        props: {
          label: 'Country',
          wrapperClass: 'col-span-1',
          options: countryOptions,
          placeholder: 'All country',
        },
      },
      {
        key: 'amount',
        type: 'select',
        props: {
          label: 'Amount',
          wrapperClass: 'col-span-1',
          options: [{label: 'Any amount', value: ''}, ...amountOptions],
          placeholder: 'Any amount',
        },
      },
      {
        key: 'planStructure',
        type: 'select',
        props: {
          label: 'Plan structure',
          wrapperClass: 'col-span-1',
          options: [{label: 'All plan structure', value: ''}, ...planStructureOptions],
          placeholder: 'All plan structure',
        },
      },
      {
        key: 'name',
        type: 'search',
        props: {
          label: 'Search',
          wrapperClass: 'col-span-2',
          placeholder: 'Search by plan ID or plan name',
          'data-testid': 'textbox',
        },
      },
    ],
  });

  const bnplPlanConfigDetailModal = useBnplPlanConfigDetailModal();

  return (
    <PageContainer
      heading="BNPL Plans"
      action={
        <>
          <HasPermission accessWith={[adminBnplPlanConfig.adminCreate]}>
            <Button variant="primary" onClick={bnplPlanConfigDetailModal.open}>
              CREATE
            </Button>
            {bnplPlanConfigDetailModal.component}
          </HasPermission>
        </>
      }>
      <div className="space-y-5">
        <FilterControls className="grid-cols-4" filter={filter} />
        <Filter filter={filter} />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data &&
            (data.items.length > 0 || pagination.page > 1) && (
              <PaginationNavigation
                variant="page-list"
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={data.total}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Plan Id</Table.Th>
              <Table.Th>Plan Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Plan Type</Table.Th>
              <Table.Th className="text-right">Min. Amount (RM)</Table.Th>
              <Table.Th className="text-right">Max. Amount (RM)</Table.Th>
              <Table.Th className="text-right">Plan Structure</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((plan: IPlan) => (
                <Table.Tr
                  key={plan.id}
                  render={(props) => (
                    <Link
                      to={`/buy-now-pay-later/plans/details/${plan.id}`}
                      data-testid="plan-record"
                      {...props}
                    />
                  )}>
                  <Table.Td>{plan.id}</Table.Td>

                  <Table.Td>{titleCase(plan.name) || '-'}</Table.Td>

                  <Table.Td>
                    <Badge color={statusColor[plan.status]}>{plan.status.toUpperCase()}</Badge>
                  </Table.Td>

                  <Table.Td>{titleCase(plan.instructionInterval) || '-'}</Table.Td>

                  <Table.Td className="text-right">{formatMoney(plan.minAmount)}</Table.Td>
                  <Table.Td className="text-right">{formatMoney(plan.maxAmount)}</Table.Td>
                  <Table.Td className="text-right">{titleCase(plan.planStructure) || '-'}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          {data && data.items.length === 0 && (
            <Table.Caption>
              <div className="p-6 text-center">
                <span>No records found.</span>
              </div>
            </Table.Caption>
          )}
        </Table>
      </div>
    </PageContainer>
  );
};

interface FilterValues {
  status: PlanStatus;
  instructionInterval: PlanType;
  currencyCode: Currency;
  country: Country;
  amount: string;
  planStructure: PlanStructure;
  name: string;
}

const transformToApiFilter = ({...filter}: FilterValues): GetBnplPlanOptions => {
  return {
    ...filter,
  };
};

// import React from 'react';
// import {PageContainer} from 'src/react/components/page-container';
// import cx from 'classnames';
// import {
//   classes,
//   Text,
//   DataTable as Table,
//   DataTableRow as Tr,
//   DataTableCell as Td,
//   DataTableRowGroup,
//   Badge,
//   usePaginationState,
//   PaginationNavigation,
//   formatMoney,
// } from '@setel/portal-ui';
// import {Link} from 'src/react/routing/link';
// import {bnplAccountTransactionsStatusColor} from '../bnpl-account.constant';
// // import {useBnplAccountTransactions} from '../bnpl-account.queries';transactions
// import {BnplAccountStatus, IBnplAccountTransaction} from '../bnpl-account.type';

// export const TransactionPaymentHistory = () => {
//   const {page, perPage, setPage, setPerPage} = usePaginationState();
//   // const {data} = useBnplAccountTransactions();
//   const accountTransactions: IBnplAccountTransaction[] = [];
//   for (let i = 0; i < 21; i++) {
//     accountTransactions.push({
//       transaction_id: '4435d0a98bd04846',
//       status: BnplAccountStatus.active,
//       type: ['Bill payment','Refund payment'][Math.floor(Math.random()*['Setel Wallet','CardTerus 2.0'].length)],
//       amount: 3000,
//       available: 2000,
//       payment_method: ['Setel Wallet','CardTerus 2.0'][Math.floor(Math.random()*['Setel Wallet','CardTerus 2.0'].length)],
//       error_message: ['Insufficient balance','-'][Math.floor(Math.random()*['Insufficient balance','-'].length)],
//     });
//   }

//   const pageContainer = () => {
//     if (!accountTransactions) {
//       return <PageContainer />;
//     }

//     return (
//       <PageContainer heading="John Doe bin Ismail - TransactionPaymentHistory">
//         <div className="card rounded-lg">
//           <div className={cx('card-body')}>
//             <div className={cx('ml-1')}>
//               <Text className={classes.h2}>Transaction payment history</Text>
//             </div>
//           </div>
//           <div className={cx('border')}>
//             <Table>
//               <DataTableRowGroup groupType="thead">
//                 <Tr>
//                   <Td className="text-left">
//                     <div className={cx('ml-2')}>TRANSACTION ID</div>
//                   </Td>
//                   <Td className="text-right">STATUS</Td>
//                   <Td className="text-right">TYPE</Td>
//                   <Td className="text-right">AMOUNT (RM)</Td>
//                   <Td className="text-right">AVAILABLE LIMIT (RM)</Td>
//                   <Td className="text-right">PAYMENT METHOD</Td>
//                   <Td className="text-right">ERROR MESSAGE</Td>
//                 </Tr>
//               </DataTableRowGroup>
//               <DataTableRowGroup>
//                 {accountTransactions.map((transaction, index) => (
//                   <Tr
//                     key={index}
//                     render={(p) => (
//                       <Link
//                         {...p}
//                         to={`buy-now-pay-later/accounts/details/7083815-9876910-27102/transactions/${transaction.transaction_id}`}
//                       />
//                     )}>
//                     <Td className="text-left">
//                       <Text className={cx('ml-2')}>{transaction.transaction_id}</Text>
//                     </Td>
  
//                     <Td className="text-right">
//                       <Badge color={bnplAccountTransactionsStatusColor[transaction.status]}>{transaction.status.toUpperCase()}</Badge>
//                     </Td>
  
//                     <Td>
//                       <div className={cx('ml-2')}>
//                         <Text className={cx('text-right')}>
//                           {transaction.type}
//                         </Text>
//                       </div>
//                     </Td>
  
//                     <Td>
//                       <div className={cx('ml-2')}>
//                         <Text className={cx('text-right')}>
//                           {formatMoney(transaction.amount, '')}
//                         </Text>
//                       </div>
//                     </Td>
                    
//                     <Td>
//                       <div className={cx('ml-2')}>
//                         <Text className={cx('text-right')}>
//                           {formatMoney(transaction.available, '')}
//                         </Text>
//                       </div>
//                     </Td>

//                     <Td>
//                       <div className={cx('ml-2')}>
//                         <Text className={cx('text-right')}>
//                           {/* {moment(startDate).format('DD MMM YYYY')} */}
//                           {transaction.payment_method}
//                         </Text>
//                       </div>
//                     </Td>
  
//                     <Td>
//                       <div className={cx('ml-2')}>
//                         <Text className={cx('text-right')}>
//                           {transaction.error_message}         
//                         </Text>
//                       </div>
//                     </Td>
//                   </Tr>
//                 ))}
//               </DataTableRowGroup>
//             </Table>
//           </div>
//           <div className="card-body">
//             <PaginationNavigation
//               total={accountTransactions.length}
//               currentPage={page}
//               perPage={perPage}
//               onChangePage={setPage}
//               onChangePageSize={setPerPage}
//             />
//           </div>
//         </div>
//       </PageContainer>
//     );
//   }

//   return pageContainer();
// };

import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {
  DataTable as Table,
  Badge,
  PaginationNavigation,
  formatMoney,
  useDataTableState,
  FilterControls,
  Filter,
} from '@setel/portal-ui';
import {Link} from 'src/react/routing/link';
import {bnplAccountTransactionsStatusColor} from '../bnpl-account.constant';
// import {useBnplAccountTransactions} from '../bnpl-account.queries';transactions
import {BnplAccountStatus, IBnplAccountTransaction} from '../bnpl-account.type';
import {bnplAccountQueryKey} from '../bnpl-account.queries';

export interface TransactionPaymentHistoryProps {
  id: string;
}

export const TransactionPaymentHistory = (props: TransactionPaymentHistoryProps) => {
  const {id} = props;
  const accountTransactions: IBnplAccountTransaction[] = [];
  // const data: any = {};
  // for (let i = 0; i < 21; i++) {
  //   data.items.push({
  //     transaction_id: '4435d0a98bd04846',
  //     status: BnplAccountStatus.active,
  //     type: ['Bill payment','Refund payment'][Math.floor(Math.random()*['Setel Wallet','CardTerus 2.0'].length)],
  //     amount: 3000,
  //     available: 2000,
  //     payment_method: ['Setel Wallet','CardTerus 2.0'][Math.floor(Math.random()*['Setel Wallet','CardTerus 2.0'].length)],
  //     error_message: ['Insufficient balance','-'][Math.floor(Math.random()*['Insufficient balance','-'].length)],
  //   });
  // }
  const {
    query: {data, isLoading, isFetching},
    pagination,
    filter,
  } = useDataTableState({
    initialFilter: {
      // status: '',
      // planType: '',
      // currencyCode: Currency.MYR,
      // country: Country.MALAYSIA,
      // amount: '',
      // planStructure: '' as any,
    } as unknown as FilterValues,
    queryKey: bnplAccountQueryKey.accountTransactions,
    // queryFn: (values) => getBnplAccountTransactions(id, transformToApiFilter(values)),
    queryFn: (values) => accountTransactions,
    components: [
      // {
      //   key: 'status',
      //   type: 'select',
      //   props: {
      //     label: 'Status',
      //     wrapperClass: 'col-span-1',
      //     options: [{label: 'All status', value: ''}, ...statusOptions],
      //     placeholder: 'All status',
      //   },
      // },
      // {
      //   key: 'instructionInterval',
      //   type: 'select',
      //   props: {
      //     label: 'Plan Type',
      //     wrapperClass: 'col-span-1',
      //     options: [{label: 'All plan type', value: ''}, ...planTypeOptions],
      //     placeholder: 'All plan type',
      //   },
      // },
      // {
      //   key: 'currencyCode',
      //   type: 'select',
      //   props: {
      //     label: 'Currency',
      //     wrapperClass: 'col-span-1',
      //     options: currencyOptions,
      //     placeholder: 'All currency',
      //   },
      // },
      // {
      //   key: 'country',
      //   type: 'select',
      //   props: {
      //     label: 'Country',
      //     wrapperClass: 'col-span-1',
      //     options: countryOptions,
      //     placeholder: 'All country',
      //   },
      // },
      // {
      //   key: 'amount',
      //   type: 'select',
      //   props: {
      //     label: 'Amount',
      //     wrapperClass: 'col-span-1',
      //     options: [{label: 'Any amount', value: ''}, ...amountOptions],
      //     placeholder: 'Any amount',
      //   },
      // },
      // {
      //   key: 'planStructure',
      //   type: 'select',
      //   props: {
      //     label: 'Plan structure',
      //     wrapperClass: 'col-span-1',
      //     options: [{label: 'All plan structure', value: ''}, ...planStructureOptions],
      //     placeholder: 'All plan structure',
      //   },
      // },
      // {
      //   key: 'name',
      //   type: 'search',
      //   props: {
      //     label: 'Search',
      //     wrapperClass: 'col-span-2',
      //     placeholder: 'Search by plan ID or plan name',
      //     'data-testid': 'textbox',
      //   },
      // },
    ],
  });

  return (
    <PageContainer
      heading="John Doe bin Ismail - TransactionPaymentHistory"
      // action={
      //   <>
      //     <HasPermission accessWith={[adminBnplPlanConfig.adminCreate]}>
      //       <Button variant="primary" onClick={bnplPlanConfigDetailModal.open}>
      //         CREATE
      //       </Button>
      //       {bnplPlanConfigDetailModal.component}
      //     </HasPermission>
      //   </>
      // }
      >
      <div className="space-y-5">
        <FilterControls className="grid-cols-4" filter={filter} />
        <Filter filter={filter} />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data &&
            (data.items.length > 0 || pagination.page > 1) && (
              <PaginationNavigation
                variant="page-list"
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={data.total}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>TRANSACTION ID</Table.Th>
              <Table.Th>STATUS</Table.Th>
              <Table.Th>TYPE</Table.Th>
              <Table.Th>AMOUNT (RM)</Table.Th>
              <Table.Th className="text-right">AVAILABLE LIMIT (RM)</Table.Th>
              <Table.Th className="text-right">PAYMENT METHOD</Table.Th>
              <Table.Th className="text-right">ERROR MESSAGE</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((transaction: IBnplAccountTransaction) => (
                <Table.Tr
                  key={transaction.transaction_id}
                  render={(props) => (
                    <Link
                    to={`buy-now-pay-later/accounts/details/${id}/transactions/${transaction.transaction_id}`}
                      data-testid="plan-record"
                      {...props}
                    />
                  )}>
                  <Table.Td>{transaction.transaction_id}</Table.Td>

                  <Table.Td>
                    <Badge color={bnplAccountTransactionsStatusColor[transaction.status]}>{transaction.status.toUpperCase()}</Badge>
                  </Table.Td>

                  <Table.Td>
                    {transaction.type}
                  </Table.Td>

                  <Table.Td>{formatMoney(transaction.amount, '')}</Table.Td>

                  <Table.Td className="text-right">{formatMoney(transaction.available, '')}</Table.Td>
                  <Table.Td className="text-right">{transaction.payment_method}</Table.Td>
                  <Table.Td className="text-right">{transaction.error_message}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          {data && data.items.length === 0 && (
            <Table.Caption>
              <div className="p-6 text-center">
                <span>No records found.</span>
              </div>
            </Table.Caption>
          )}
        </Table>
      </div>
    </PageContainer>
  );
};

interface FilterValues {
  // status: AccountStatus;
  // instructionInterval: AccountType;
  // currencyCode: Currency;
  // country: Country;
  // amount: string;
  // planStructure: AccountStructure;
  // name: string;
}

// const transformToApiFilter = ({...filter}: FilterValues): GetBnplAccountOptions => {
//   return {
//     ...filter,
//   };
// };
