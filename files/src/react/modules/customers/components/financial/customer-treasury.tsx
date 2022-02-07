import {
  Badge,
  BadgeProps,
  Button,
  CardHeading,
  DataTable as Table,
  DescItem,
  DescList,
  Modal,
  Pagination,
  PlusIcon,
  usePaginationState,
  MoneyInput,
  TextareaField,
  FieldContainer,
  isEmptyObject,
  Section,
} from '@setel/portal-ui';
import * as React from 'react';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {Currency, TransactionStatus, TransactionType} from 'src/shared/enums/wallet.enum';
import {adminAccountRole, customerRole} from 'src/shared/helpers/roles.type';
import {
  useCreateAdjustmentTransaction,
  useGetRefreshWalletBalance,
  useGetWalletTransactions,
} from '../../customers.queries';
import {useFormik} from 'formik';
import {useNotification} from 'src/react/hooks/use-notification';

export const CustomerTreasury = ({userId, walletId}: {userId: string; walletId: string}) => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const [isCardExpand, setCardExpand] = React.useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = React.useState(false);

  const {
    isError: isAdjustmentTransactionsError,
    isLoading: isLoadingAdjustmentTransactions,
    data: adjustmentTransactions,
  } = useGetWalletTransactions(
    {page, perPage, userId, type: TransactionType.ADJUSTMENT},
    {enabled: isCardExpand},
  );

  const {data: refreshWalletBalance} = useGetRefreshWalletBalance(userId, {
    enabled: isCardExpand || showAdjustmentModal,
  });
  return (
    <HasPermission accessWith={[customerRole.treasury]}>
      <Section />
      <Table
        isOpen={isCardExpand}
        isLoading={isLoadingAdjustmentTransactions}
        skeletonRowNum={2}
        onToggleOpen={() => setCardExpand((prev) => !prev)}
        heading={
          <CardHeading title="Treasury" data-testid="treasury-card-heading">
            <HasPermission
              accessWith={[customerRole.recordAdjustment, adminAccountRole.adminAdjustAdd]}>
              <Button
                data-testid="create-adjustment-button"
                variant="outline"
                leftIcon={<PlusIcon />}
                onClick={() => setShowAdjustmentModal(true)}>
                ADJUSTMENT
              </Button>
            </HasPermission>
          </CardHeading>
        }
        expandable
        pagination={
          adjustmentTransactions && (
            <Pagination
              currentPage={page}
              lastPage={Math.ceil(adjustmentTransactions.total / perPage)}
              onChangePage={setPage}
              pageSize={perPage}
              onChangePageSize={setPerPage}
              onGoToLast={() => setPage(Math.ceil(adjustmentTransactions.total / perPage))}
            />
          )
        }>
        <Table.Thead data-testid="treasury-table-heading">
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th className="text-right">AMOUNT (RM)</Table.Th>
            <Table.Th>STATUS</Table.Th>
            <Table.Th>COMMENT</Table.Th>
            <Table.Th className="text-right">CREATED ON</Table.Th>
          </Table.Tr>
        </Table.Thead>
        {adjustmentTransactions?.isEmpty || isAdjustmentTransactionsError ? (
          <EmptyDataTableCaption />
        ) : (
          <Table.Tbody>
            {adjustmentTransactions &&
              adjustmentTransactions.items.map((adjustmentTrx) => (
                <Table.Tr key={adjustmentTrx.id}>
                  <Table.Th>{adjustmentTrx.id}</Table.Th>
                  <Table.Th className="text-right">{adjustmentTrx.amount}</Table.Th>
                  <Table.Th>
                    <Badge color={transactionStatusColorMap[adjustmentTrx.status] || 'grey'}>
                      {adjustmentTrx.status}
                    </Badge>
                  </Table.Th>
                  <Table.Th>
                    {adjustmentTrx.attributes &&
                      adjustmentTrx.attributes[0] &&
                      adjustmentTrx.attributes[0][1]}
                  </Table.Th>
                  <Table.Th className="text-right">{adjustmentTrx.transactionDate}</Table.Th>
                </Table.Tr>
              ))}
          </Table.Tbody>
        )}
      </Table>
      {refreshWalletBalance && showAdjustmentModal && (
        <AdjustmentModal
          onDismiss={() => setShowAdjustmentModal(false)}
          walletId={walletId}
          userId={userId}
          refreshWalletBalance={refreshWalletBalance.balance}
        />
      )}
    </HasPermission>
  );
};

const AdjustmentModal = ({
  walletId,
  onDismiss,
  refreshWalletBalance,
  userId,
}: {
  onDismiss: () => void;
  refreshWalletBalance: number;
  walletId: string;
  userId: string;
}) => {
  const showNotification = useNotification();
  const {mutate: createAdjustmentTransaction, isLoading} = useCreateAdjustmentTransaction();
  const {handleSubmit, setFieldValue, values, touched, errors, handleBlur, handleChange} =
    useFormik<AdjustmentFormInput>({
      initialValues: {
        adjustmentValue: '',
        comment: '',
      },
      onSubmit: (values) => {
        if (!isEmptyObject(errors)) {
          return;
        }
        const adjustmentData = {
          amount: Number(values.adjustmentValue),
          customerId: userId,
          currency: Currency.MYR,
          comment: values.comment,
        };

        createAdjustmentTransaction(adjustmentData, {
          onSuccess: (data) => {
            onDismiss();
            showNotification({
              title: 'Successful!',
              variant: 'success',
              description: `Successfully granted RM${data.amount}.`,
            });
          },
          onError: (err) => {
            showNotification({
              variant: 'error',
              title: err.toString(),
            });
            onDismiss();
          },
        });
      },
      validate: ({adjustmentValue}) => {
        return +adjustmentValue ? {} : {adjustmentValue: 'Required a positive or negative number'};
      },
    });

  return (
    <Modal header="Adjust customer balance" isOpen onDismiss={onDismiss}>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <DescList className="mb-4">
            <DescItem label="Customer wallet" value={walletId} />
            <DescItem label="Balance" value={`RM${refreshWalletBalance}`} />
          </DescList>

          <FieldContainer
            label="Adjustment value"
            helpText={
              touched.adjustmentValue && errors.adjustmentValue ? errors.adjustmentValue : undefined
            }
            status={touched.adjustmentValue && errors.adjustmentValue ? 'error' : undefined}>
            <MoneyInput
              onChange={handleChange}
              onBlur={handleBlur}
              name="adjustmentValue"
              decimalPlaces={2}
              data-testid="adjustment-value-input"
              onChangeValue={(value) => setFieldValue('adjustmentValue', value)}
              value={values.adjustmentValue}
              allowNegative
            />
          </FieldContainer>
          <TextareaField
            data-testid="comment-input"
            label="Comment"
            name="comment"
            onBlur={handleBlur}
            value={values.comment}
            onChangeValue={(value) => setFieldValue('comment', value)}
          />
        </Modal.Body>
        <Modal.Footer className="text-right space-x-3">
          <Button variant="outline" onClick={onDismiss}>
            CANCEL
          </Button>
          <Button
            variant="primary"
            data-testid="adjustment-submit-button"
            type="submit"
            isLoading={isLoading}>
            SUBMIT
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

const transactionStatusColorMap: Record<string, BadgeProps['color']> = {
  [TransactionStatus.SUCCEEDED]: 'success',
  [TransactionStatus.FAILED]: 'error',
  [TransactionStatus.EXPIRED]: 'warning',
};

interface AdjustmentFormInput {
  adjustmentValue: string;
  comment: string;
}
