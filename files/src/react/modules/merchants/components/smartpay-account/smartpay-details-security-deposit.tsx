import * as React from 'react';
import {
  Button,
  Card,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  formatMoney,
  PaginationNavigation,
  PlusIcon,
  Text,
  titleCase,
} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import {SmartpayDetailsSecurityDepositModal as DepositModal} from './smartpay-details-security-deposit-modal';
import {merchantQueryKey, useTotalSecurityDeposits} from '../../merchants.queries';
import {getSmartpaySecurityDeposits} from '../../merchants.service';
import {useDataTableState} from '../../../../hooks/use-state-with-query-params';
import {AuditLogs} from './audit-logs';
import {AuditLogFeatureName} from '../../merchants.type';

export const SmartpayDetailsSecurityDeposit = (props: {
  merchantId: string;
  applicationId: string;
}) => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [depositIdToEdit, setDepositIdToEdit] = React.useState('');

  const setNotify = useNotification();

  const {pagination, query} = useDataTableState({
    initialFilter: {},
    initialPerPage: 10,
    queryKey: [merchantQueryKey.smartpaySecurityDepositsList, props.applicationId],
    queryFn: (pagingParam) => getSmartpaySecurityDeposits(props.applicationId, pagingParam),
  });
  const {data: totalAmount} = useTotalSecurityDeposits(props.applicationId);

  return (
    <React.Fragment>
      <Card className="mb-8">
        <Card.Heading title="Security deposit">
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            leftIcon={<PlusIcon />}>
            CREATE
          </Button>
        </Card.Heading>

        <Card.Content className={'px-0 py-0'}>
          <div className="px-7 py-5">
            <Text className="uppercase font-bold text-xs text-lightgrey">
              Total security deposit
            </Text>
            <Text className="font-bold text-lg">{`RM${formatMoney(
              totalAmount?.total || '',
            )}`}</Text>
          </div>

          <DataTable
            isLoading={query.isLoading}
            isFetching={query.isFetching}
            pagination={
              <PaginationNavigation
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={query.data ? query.data.total : 0}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
                pageSizeOptions={[10, 20, 50, 100]}
              />
            }>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td className="pl-8">Type</Td>
                <Td>Bank account type</Td>
                <Td>Bank name</Td>
                <Td>{`Security deposit amount (RM)`}</Td>
                <Td className="text-right pr-8" />
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {query.data &&
                query.data.items.map((deposit, index) => (
                  <Tr key={index}>
                    <Td className="pl-8 whitespace-normal">
                      {titleCase(deposit.securityDepositType, {
                        hasUnderscore: true,
                      })}
                    </Td>
                    <Td>
                      {titleCase(deposit.bankAccountType, {
                        hasUnderscore: true,
                      }) || '-'}
                    </Td>
                    <Td className="whitespace-normal">
                      {titleCase(deposit.bankName, {
                        hasUnderscore: true,
                      }) || '-'}
                    </Td>
                    <Td>{formatMoney(deposit.securityDepositAmount)}</Td>
                    <Td
                      className="text-center cursor-pointer font-bold text-brand-500"
                      onClick={() => {
                        setDepositIdToEdit(deposit.id);
                        setShowEditModal(true);
                      }}>
                      EDIT
                    </Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
            {query.data?.isEmpty && (
              <DataTableCaption>
                <div className="py-6">
                  <p className="text-center text-gray-400 text-sm">No security deposit found</p>
                </div>
              </DataTableCaption>
            )}
          </DataTable>
        </Card.Content>

        {showCreateModal && (
          <DepositModal
            applicationId={props.applicationId}
            isEdit={false}
            onClose={(message) => {
              setShowCreateModal(false);
              message === 'success' &&
                setNotify({
                  title: 'Successful!',
                  variant: 'success',
                  description: 'You have successfully created your security deposit',
                });
            }}
          />
        )}

        {showEditModal && (
          <DepositModal
            isEdit={true}
            isMerchant={!!props.merchantId}
            depositId={depositIdToEdit}
            onClose={(message) => {
              setShowEditModal(false);
              ['success', 'delete_success'].includes(message) &&
                setNotify({
                  title: 'Successful!',
                  variant: 'success',
                  description:
                    message === 'success'
                      ? 'You have successfully updated your security deposit'
                      : 'You have successfully deleted your security deposit',
                });
            }}
          />
        )}
      </Card>
      {props.applicationId && (
        <AuditLogs refId={props.applicationId} featureName={AuditLogFeatureName.SECURITY_DEPOSIT} />
      )}
    </React.Fragment>
  );
};
