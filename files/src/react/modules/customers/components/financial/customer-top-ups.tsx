import * as React from 'react';
import {
  Card,
  CardHeading,
  DataTable as Table,
  SectionHeading,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandRow,
  Modal,
  TextareaField,
  FieldContainer,
  DropdownSelect,
  Button,
  MoneyInput,
  DaySelector,
  formatDate,
  Badge,
  usePaginationState,
  DescList,
  DescItem,
  Pagination,
  DecimalInput,
  MultiInput,
  DialogContent,
  Dialog,
} from '@setel/portal-ui';
import {
  usecreateExternalTransaction,
  useCustomerDetails,
  useDeleteCreditCard,
  useGetCustomerIncomingBalanceTransactions,
  useGrantWallet,
  useIndexCustomerTransactions,
  useIndexExpiringBalance,
  useIndexUserCreditCards,
  useReadAutoTopup,
} from '../../customers.queries';
import {Link} from 'src/react/routing/link';
import {
  ICreateTransactionInput,
  IGrantWalletInput,
  ITransactionStatus,
} from 'src/shared/interfaces/transaction.interface';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {TransactionSubType, TransactionType} from 'src/app/stations/shared/const-var';
import {useNotification} from 'src/react/hooks/use-notification';
import {mappingPaymentMethodLogos} from 'src/react/modules/fee-plans/fee-plans.constant';
import {maskCardNumber} from '../../customers.helper';
import {TransactionType as TransactionParamType} from 'src/react/services/api-ops.service';
import CustomerCheckoutTransactions from './customer-checkout-transactions';
import {AxiosError} from 'axios';

export function customerTopUpAndPayments({userId}: {userId: string}) {
  return (
    <>
      <SectionHeading className="mb-4" title="Top-up and payment (Beta)" />
      <CustomerTopUp userId={userId} />
      <div className="mb-8" />
      <IncomingBalanceTransaction userId={userId} />
      <PaymentVendorTransaction userId={userId} />
      <CreditDebitCards userId={userId} />
      <AutoTopUp userId={userId} />
      <CustomerCheckoutTransactions userId={userId} />
      <ExpiringWalletBalance userId={userId} />
    </>
  );
}

export function CustomerTopUp({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const [isRecordExternalTopUpModal, setRecordExternalTopUpModal] = React.useState(false);
  const [isGrantWalletModalOpen, setGrantWalletModalOpen] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();

  const {data: TopUpCardDetails, isLoading: isLoadingBudget} = useIndexCustomerTransactions(
    {page, perPage, userId, types: [TransactionParamType.TOPUP, TransactionParamType.REFUND]},
    {enabled: isCardExpand},
  );

  const CustomerPaymentMethodType = {
    [TransactionSubType.topupExternal]: 'External top-up',
    [TransactionSubType.refundExternal]: 'External top-up refund',
    [TransactionSubType.topupBankAccount]: 'Bank',
    [TransactionSubType.redeemLoyaltyPoints]: 'Mesra Point Redemption',
    [TransactionSubType.rewards]: 'Granted Wallet Balance',
    [TransactionSubType.autoTopup]: 'Auto Top-up',
  } as const;

  return (
    <>
      {isRecordExternalTopUpModal && (
        <RecordExternalTopUpModal
          isOpen={isRecordExternalTopUpModal}
          onClose={() => setRecordExternalTopUpModal(false)}
          userId={userId}
        />
      )}

      {isGrantWalletModalOpen && (
        <GrantWalletBalanceModal
          isOpen={isGrantWalletModalOpen}
          onClose={() => setGrantWalletModalOpen(false)}
          userId={userId}
        />
      )}

      <Table
        type="primary"
        expandable
        native
        isLoading={isLoadingBudget}
        data-testid="customer-top-up-table-card"
        className="mb-8"
        isOpen={isCardExpand}
        onToggleOpen={() => setCardExpand((prev) => !prev)}
        pagination={
          TopUpCardDetails?.total > 20 &&
          isCardExpand && (
            <Pagination
              variant="page-list"
              lastPage={Math.min(Math.max(5, page + 2), TopUpCardDetails?.pageCount)}
              currentPage={page}
              pageSize={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
              onGoToLast={() => setPage(TopUpCardDetails?.pageCount)}
            />
          )
        }
        heading={
          <CardHeading title="Top-up" data-testid="top-up-card-heading">
            {/* Button for External Top up */}
            <Button
              className="ml-3"
              variant="outline"
              data-testid="record-external-top-up-button"
              minWidth="none"
              //Temporary OnClick function
              onClick={() => setRecordExternalTopUpModal((prev) => !prev)}>
              RECORD EXTERNAL TOP-UP
            </Button>

            {/* Button for Grant Wallet Balance */}
            <Button
              className="ml-3"
              variant="outline"
              data-testid="grant-wallet-balance-button"
              minWidth="none"
              //Temporary OnClick function
              onClick={() => setGrantWalletModalOpen((prev) => !prev)}>
              GRANT WALLET BALANCE
            </Button>
          </CardHeading>
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Td>TRANSACTION ID</Table.Td>
            <Table.Td>STATUS</Table.Td>
            <Table.Td className="text-right">AMOUNT (RM)</Table.Td>
            <Table.Td className="text-right">WALLET BALANCE</Table.Td>
            <Table.Td className="text-right">CREATED ON</Table.Td>
          </Table.Tr>
        </Table.Thead>

        {!isLoadingBudget && TopUpCardDetails && TopUpCardDetails?.total ? (
          <Table.Tbody>
            {TopUpCardDetails &&
              TopUpCardDetails?.items.map((topUpCardDetails) => (
                <ExpandGroup key={topUpCardDetails?.id}>
                  <Table.Tr>
                    <Table.Td>
                      <ExpandButton data-testid="transaction-top-up-expand-button-row" />
                      <Link
                        className="inline"
                        to={`/payments/transactions/${topUpCardDetails?.id}`}>
                        {topUpCardDetails?.id ?? '-'}
                      </Link>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        className="uppercase"
                        color={CustomerTransactionStatusColor[topUpCardDetails.status]}>
                        {topUpCardDetails.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="text-right">{topUpCardDetails.amount ?? '-'}</Table.Td>
                    <Table.Td className="text-right">
                      {topUpCardDetails.walletBalance ?? '-'}
                    </Table.Td>
                    <Table.Td className="text-right">
                      {(topUpCardDetails?.createdAt && formatDate(topUpCardDetails.createdAt)) ||
                        '-'}
                    </Table.Td>
                  </Table.Tr>

                  <ExpandRow>
                    <DescList>
                      <DescItem
                        label="Payment Method"
                        value={
                          <div>
                            <img
                              src={
                                mappingPaymentMethodLogos[
                                  topUpCardDetails?.creditCardTransaction?.cardSchema
                                ]
                              }
                              className="inline h-8"
                            />

                            {topUpCardDetails?.creditCardTransaction?.cardSchema
                              ? topUpCardDetails?.creditCardTransaction?.cardSchema +
                                '-' +
                                topUpCardDetails?.creditCardTransaction?.lastForDigits
                              : CustomerPaymentMethodType[topUpCardDetails?.subtype] ?? '-'}
                          </div>
                        }
                      />
                      <DescItem
                        label="Error message"
                        value={topUpCardDetails?.error?.description ?? '-'}
                      />
                      <DescItem label="Remarks" value={topUpCardDetails?.message ?? '-'} />
                    </DescList>
                  </ExpandRow>
                </ExpandGroup>
              ))}
          </Table.Tbody>
        ) : (
          <EmptyDataTableCaption />
        )}
      </Table>
    </>
  );
}

const CustomerTransactionStatusColor = {
  [ITransactionStatus.SUCCESS]: 'success',
  [ITransactionStatus.ERROR]: 'error',
  [ITransactionStatus.FAILED]: 'error',
  [ITransactionStatus.PENDING]: 'lemon',
  [ITransactionStatus.CANCELLED]: 'warning',
  [ITransactionStatus.INCOMING]: 'lemon',
  [ITransactionStatus.REVERSED]: 'blue',
} as const;

export function IncomingBalanceTransaction({userId}: {userId: string}) {
  userId;
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {data: IncomingBalance, isLoading: isLoadingBalance} =
    useGetCustomerIncomingBalanceTransactions(userId, {
      enabled: isCardExpand,
    });

  return (
    <Card
      data-testid="customer-incoming-balance-transactions-card"
      className="mb-8"
      expandable
      isOpen={isCardExpand}
      isLoading={isLoadingBalance}
      onToggleOpen={() => setCardExpand((prev) => !prev)}>
      <CardHeading title="Incoming balance transactions" />
      <Table type="primary" isLoading={isLoadingBalance}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="text-right">AMOUNT (RM)</Table.Th>
            <Table.Th>STATUS</Table.Th>
            <Table.Th>TRANSACTION ID</Table.Th>
            <Table.Th>TOP UP METHOD</Table.Th>
            <Table.Th className="text-right">CREATED ON</Table.Th>
          </Table.Tr>
        </Table.Thead>

        {!isLoadingBalance && IncomingBalance && IncomingBalance?.length ? (
          <Table.Tbody>
            {IncomingBalance &&
              IncomingBalance.map((incomingBalance) => (
                <ExpandGroup key={incomingBalance._id}>
                  <Table.Tr>
                    <Table.Td className="text-right">{incomingBalance.amount ?? '-'}</Table.Td>
                    <Table.Td>
                      <Badge
                        className="uppercase"
                        color={IncomingBalanceStatusColor[incomingBalance.status]}>
                        {incomingBalance.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Link className="inline" to={`payments/transactions/${incomingBalance._id}`}>
                        {incomingBalance._id ?? '-'}
                      </Link>
                    </Table.Td>
                    <Table.Td>{incomingBalance.type ?? '-'}</Table.Td>
                    <Table.Td className="text-right">
                      {(incomingBalance?.createdAt && formatDate(incomingBalance.createdAt)) || '-'}
                    </Table.Td>
                  </Table.Tr>
                </ExpandGroup>
              ))}
          </Table.Tbody>
        ) : (
          <EmptyDataTableCaption />
        )}
      </Table>
    </Card>
  );
}

const IncomingBalanceStatusColor = {
  [ITransactionStatus.SUCCESS]: 'success',
  [ITransactionStatus.ERROR]: 'error',
  [ITransactionStatus.FAILED]: 'error',
  [ITransactionStatus.PENDING]: 'lemon',
  [ITransactionStatus.CANCELLED]: 'warning',
  [ITransactionStatus.INCOMING]: 'lemon',
  [ITransactionStatus.REVERSED]: 'blue',
} as const;

export function PaymentVendorTransaction({userId}: {userId: string}) {
  userId;
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {data: VendorTransaction, isLoading: isLoadingVendor} = useIndexCustomerTransactions(
    {page: 1, perPage: 25, userId},
    {
      enabled: isCardExpand,
    },
  );

  const {data: customerDetails} = useCustomerDetails(userId);

  return (
    <Card
      data-testid="customer-payment-vendor-transaction-card"
      className="mb-8"
      expandable
      isOpen={isCardExpand}
      isLoading={isLoadingVendor}
      onToggleOpen={() => setCardExpand((prev) => !prev)}>
      <CardHeading title="Payment transaction" />
      <Table type="primary" isLoading={isLoadingVendor}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="text-right">AMOUNT (RM)</Table.Th>
            <Table.Th>FULL NAME</Table.Th>
            <Table.Th>REFERENCE ID</Table.Th>
            <Table.Th>TYPE</Table.Th>
            <Table.Th className="text-right">CREATED ON</Table.Th>
          </Table.Tr>
        </Table.Thead>

        {!isLoadingVendor && VendorTransaction && VendorTransaction?.items?.length ? (
          <Table.Tbody>
            {VendorTransaction &&
              VendorTransaction.items.map((vendorTransaction) => (
                <ExpandGroup key={vendorTransaction.id}>
                  <Table.Tr>
                    <Table.Td className="text-right">{vendorTransaction?.amount ?? '-'}</Table.Td>
                    <Table.Td>{customerDetails?.fullName ?? '-'}</Table.Td>
                    <Table.Td>{vendorTransaction?.referenceId ?? '-'}</Table.Td>
                    <Table.Td>{vendorTransaction?.type ?? '-'}</Table.Td>
                    <Table.Td className="text-right">
                      {(vendorTransaction?.createdAt && formatDate(vendorTransaction.createdAt)) ||
                        '-'}
                    </Table.Td>
                  </Table.Tr>
                </ExpandGroup>
              ))}
          </Table.Tbody>
        ) : (
          <EmptyDataTableCaption />
        )}
      </Table>
    </Card>
  );
}

export function CreditDebitCards({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {
    data: CreditCards,
    isLoading: isLoadingCreditCard,
    refetch,
  } = useIndexUserCreditCards(userId, {
    enabled: isCardExpand,
  });
  const [isUnlinkCardModalOpen, setsUnlinkCardModalOpen] = React.useState(false);

  return (
    <>
      <UnlinkCardModal
        isOpen={isUnlinkCardModalOpen}
        onClose={() => setsUnlinkCardModalOpen(false)}
        creditCardId={CreditCards?.map((CreditCardId) => CreditCardId?.id)}
        creditCardSchema={CreditCards?.map((CreditCardSchema) => CreditCardSchema?.cardSchema)}
        CreditCardLastFourDigits={CreditCards?.map(
          (CreditCardLastFourDigits) => CreditCardLastFourDigits?.lastFourDigits,
        )}
      />

      <Card
        data-testid="customer-credit-debit-card"
        className="mb-8"
        expandable
        isOpen={isCardExpand}
        onToggleOpen={() => setCardExpand((prev) => !prev)}>
        <CardHeading title="Credit/ debit cards" />
        <Table type="primary" isLoading={isLoadingCreditCard}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-64">CARD DETAILS</Table.Th>
              <Table.Th className="text-left">PRIMARY</Table.Th>
              <Table.Th className="text-right">ACTION</Table.Th>
            </Table.Tr>
          </Table.Thead>

          {!isLoadingCreditCard && CreditCards && CreditCards?.length ? (
            <Table.Tbody>
              {CreditCards &&
                CreditCards.map((CreditCard) => (
                  <ExpandGroup key={CreditCard.id}>
                    <Table.Tr>
                      <Table.Td className="w-64">
                        <Link className="inline" to={`/customers/${userId}/cards/${CreditCard.id}`}>
                          <img
                            src={mappingPaymentMethodLogos[CreditCard.cardSchema]}
                            className="inline h-8"
                          />{' '}
                          {maskCardNumber(CreditCard.lastFourDigits)}
                        </Link>
                      </Table.Td>
                      <Table.Td className="text-left">
                        {CreditCard.isDefault ? 'Yes' : 'No'}
                      </Table.Td>
                      <Table.Td className="text-right">
                        <button
                          className="text-red-500 font-bold"
                          onClick={() => setsUnlinkCardModalOpen((prev) => !prev)}>
                          UNLINK
                        </button>
                      </Table.Td>
                    </Table.Tr>
                  </ExpandGroup>
                ))}
            </Table.Tbody>
          ) : (
            <EmptyDataTableCaption />
          )}
        </Table>
      </Card>
    </>
  );
  function UnlinkCardModal({
    isOpen,
    onClose,
    creditCardId,
    creditCardSchema,
    CreditCardLastFourDigits,
  }) {
    const cancelRef = React.useRef(null);
    const showMessage = useNotification();

    const handleDismiss = () => {
      onClose();
      refetch();
      //reset mutation
    };
    const {mutate: mutateDeleteCreditCardStatus, isLoading: isLoadingMutateCreditCard} =
      useDeleteCreditCard();

    return (
      <>
        {isOpen && (
          <Dialog onDismiss={onClose} leastDestructiveRef={cancelRef}>
            <DialogContent header="Are you sure to unlink this card?">
              <div className="mb-2">
                {`You are about to unlink ${creditCardSchema}${maskCardNumber(
                  CreditCardLastFourDigits,
                )} card and this action cannot be undone and you will not be able to recover any data.`}
              </div>
            </DialogContent>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose} ref={cancelRef}>
                CANCEL
              </Button>
              <Button
                variant="error"
                isLoading={isLoadingMutateCreditCard}
                onClick={() =>
                  mutateDeleteCreditCardStatus(
                    {cardNumber: creditCardId},
                    {
                      onSuccess: () => {
                        handleDismiss();
                        showMessage({
                          title: 'Successful!',
                          variant: 'success',
                          description: 'Card unlinked',
                        });
                      },
                      onError: () => {
                        showMessage({
                          title: 'Error!',
                          variant: 'error',
                          description: 'Ops! Unable to unlink card.',
                        });
                        handleDismiss();
                      },
                    },
                  )
                }>
                CONFIRM
              </Button>
            </Dialog.Footer>
          </Dialog>
        )}
      </>
    );
  }
}

export function AutoTopUp({userId}: {userId: string}) {
  userId;
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {data: AutoTopUp, isLoading: isLoadingAutoTopUp} = useReadAutoTopup(userId, {
    enabled: isCardExpand,
  });

  return (
    <Card
      data-testid="customer-auto-top-up-card"
      className="mb-8"
      expandable
      isOpen={isCardExpand}
      isLoading={isLoadingAutoTopUp}
      onToggleOpen={() => setCardExpand((prev) => !prev)}>
      <CardHeading title="Auto top-up" />
      <Table type="primary" isLoading={isLoadingAutoTopUp}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="ml-8">CARD</Table.Th>
            <Table.Th>STATUS</Table.Th>
            <Table.Th>MINIMUM BALANCE (RM)</Table.Th>
            <Table.Th>TOP-UP AMOUNT (RM)</Table.Th>
            <Table.Th className="text-right">UPDATE ON</Table.Th>
          </Table.Tr>
        </Table.Thead>

        {!isLoadingAutoTopUp && AutoTopUp && AutoTopUp?.id ? (
          <Table.Tbody>
            {AutoTopUp && (
              <ExpandGroup key={AutoTopUp.id}>
                <Table.Tr>
                  <Table.Td>
                    <img
                      src={mappingPaymentMethodLogos[AutoTopUp.cardSchema]}
                      className="inline h-8"
                    />{' '}
                    {maskCardNumber(AutoTopUp.lastFourDigits)}
                  </Table.Td>
                  <Table.Td>
                    {AutoTopUp?.isActivated}
                    <Badge
                      data-testid="autoTopUp-status"
                      color={AutoTopUp?.isActivated ? 'success' : 'grey'}>
                      {AutoTopUp?.isActivated ? 'ACTIVE' : 'DISABLED'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{AutoTopUp?.minimumBalanceThreshold ?? '-'} </Table.Td>
                  <Table.Td>{AutoTopUp?.topupAmount ?? '-'} </Table.Td>
                  <Table.Td className="text-right">
                    {(AutoTopUp?.createdAt && formatDate(AutoTopUp.createdAt)) || '-'}
                  </Table.Td>
                </Table.Tr>
              </ExpandGroup>
            )}
          </Table.Tbody>
        ) : (
          <EmptyDataTableCaption />
        )}
      </Table>
    </Card>
  );
}

export function ExpiringWalletBalance({userId}: {userId: string}) {
  userId;
  const {data: ExpiringBalance, isLoading: isLoadingExpiringWallet} =
    useIndexExpiringBalance(userId);
  return (
    <Card
      data-testid="expiring-wallet-balance-card"
      className="mb-8"
      isLoading={isLoadingExpiringWallet}>
      <CardHeading
        title={
          <>
            <span className="inline mr-64">Expiring Wallet Balance</span>
            <span className="inline">RM{ExpiringBalance?.expiryBalance}</span>
          </>
        }
        className="center"></CardHeading>
    </Card>
  );
}

function RecordExternalTopUpModal({isOpen, onClose, userId}) {
  const [isFormSubmitted, setFormSubmitted] = React.useState(false);
  const {mutate: mutateExternalTransaction, isLoading: isLoadingMutateExternalTransaction} =
    usecreateExternalTransaction();
  const [externalTransactionInput, setExternalTransactionInput] =
    React.useState<ICreateTransactionInput>({
      amount: 0.0,
      userId: userId,
      type: undefined,
      createdAt: new Date(),
      message: '',
    });
  const showMessage = useNotification();
  const isValidForm = !!externalTransactionInput.amount && !!externalTransactionInput.type;

  function handleSubmit() {
    setFormSubmitted(true);
    if (!isValidForm) {
      return;
    }
    mutateExternalTransaction(
      {...externalTransactionInput},
      {
        onSuccess: () => {
          showMessage({
            title: 'Successful!',
            variant: 'success',
            description: 'External Top-up was succesfully added',
          });
          onClose();
        },
        onError: () => {
          showMessage({
            title: 'Error!',
            variant: 'error',
            description: 'Something went wrong!!',
          });
          onClose();
        },
      },
    );
  }

  return (
    <Modal
      data-testid="replace-member-tier-modal"
      isOpen={isOpen}
      onDismiss={onClose}
      header="Record external top-up"
      initialFocus="content">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}>
        <Modal.Body>
          {/* DescList like component that have the same spacing as TextField */}
          <FieldContainer
            className="mt-5"
            label="Type"
            forceShrink
            layout="horizontal-responsive"
            status={externalTransactionInput.type || !isFormSubmitted ? undefined : 'error'}
            helpText={externalTransactionInput.type || !isFormSubmitted ? undefined : 'Required'}>
            <DropdownSelect
              data-testid="select-type-dropdown"
              className="w-60"
              placeholder="Select Type"
              value={externalTransactionInput.type}
              onChangeValue={(newType) => {
                setExternalTransactionInput((prev) => ({...prev, type: newType}));
              }}
              options={TransactionDropdownOptions}
            />
          </FieldContainer>

          <FieldContainer
            className="mt-5"
            status={externalTransactionInput.amount || !isFormSubmitted ? undefined : 'error'}
            helpText={externalTransactionInput.amount || !isFormSubmitted ? undefined : 'Required'}
            label="Amount"
            layout="horizontal-responsive">
            <MoneyInput
              data-testid="money"
              value={'' + externalTransactionInput.amount}
              onChangeValue={(value) =>
                setExternalTransactionInput((prev) => ({...prev, amount: +value}))
              }
              className="w-60"
            />
          </FieldContainer>

          <TextareaField
            data-testid="customDescriptor"
            label="Custom Descriptor"
            layout="horizontal"
            className="w-60"
            placeholder="Enter Custom Description"
            value={externalTransactionInput.message}
            onChangeValue={(newCustomDescriptor) => {
              setExternalTransactionInput((prev) => ({...prev, message: newCustomDescriptor}));
            }}
          />
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button
            onClick={onClose}
            variant="outline"
            data-testid="record-external-modal-cancel-button">
            CANCEL
          </Button>
          <Button
            data-testid="submitButton"
            className="ml-3"
            type="submit"
            isLoading={isLoadingMutateExternalTransaction}
            variant="primary">
            SUBMIT
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

const TransactionDropdownOptions = [
  {
    label: 'External top-up',
    value: TransactionType.topup,
  },
  {
    label: 'External top-up refund',
    value: TransactionType.refund,
  },
];

function GrantWalletBalanceModal({isOpen, onClose, userId}) {
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);
  const [GrantWalletInput, setGrantWalletInput] = React.useState<IGrantWalletInput>({
    userId: userId,
    amount: undefined,
    expiryDate: undefined,
    tag: [],
    message: '',
  });
  const [tagInputHelpText, setTagInputHelpText] = React.useState('');
  const {mutate: mutateGrantWalletBalance, isLoading: isLoadingGrantWallet} = useGrantWallet();
  const showMessage = useNotification();
  const isValidForm = !!GrantWalletInput.amount && !!GrantWalletInput.message;

  function validateTagInput(input: string): boolean {
    //update helpText
    const helpText = generateHelpText(input);
    setTagInputHelpText(helpText);

    return !helpText;
  }
  function generateHelpText(input: string) {
    const lengthError = input.length > 25 ? 'Tag length must be less or equal 25 characters ' : '';
    const tagError =
      input && !/^[a-z0-9_\-]+$/.test(input) ? `Tag must contain only a-z, 0-9, -, _ ` : '';
    const duplicateError = GrantWalletInput.tag.includes(input) ? 'Tag already exists ' : '';
    return lengthError + tagError + duplicateError;
  }

  function handleSubmit() {
    setIsFormSubmitted(true);
    if (!isValidForm) {
      return;
    }
    mutateGrantWalletBalance(
      {...GrantWalletInput},
      {
        onSuccess: () => {
          showMessage({
            title: 'Successful!',
            variant: 'success',
            description: 'Wallet amount was successfully granted.',
          });
          onClose();
        },
        onError: (err: AxiosError) => {
          const response = err.response && err.response.data;
          showMessage({
            title: 'Error!',
            variant: 'error',
            description: response?.description || err.message,
          });
          onClose();
        },
      },
    );
  }

  const currentDate = new Date();
  return (
    <Modal
      data-testid="grant-wallet-balance-modal"
      isOpen={isOpen}
      onDismiss={onClose}
      header="Grant Wallet Balance"
      initialFocus="content">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}>
        <Modal.Body data-testid="modal-body">
          {/* DescList like component that have the same spacing as TextField */}

          <FieldContainer
            className="mt-5 relative"
            label="Amount"
            layout="horizontal-responsive"
            status={GrantWalletInput.amount || !isFormSubmitted ? undefined : 'error'}
            helpText={GrantWalletInput.amount || !isFormSubmitted ? undefined : 'Required'}>
            <DecimalInput
              data-testid="points-input"
              value={'' + GrantWalletInput.amount}
              onChangeValue={(value) => setGrantWalletInput((prev) => ({...prev, amount: +value}))}
              className="w-30"
            />
            <div className="absolute inset-y-1.5 left-56 text-mediumgrey ">points</div>
          </FieldContainer>

          <FieldContainer
            className="mt-5"
            label="Expiry date"
            layout="horizontal-responsive"
            status={GrantWalletInput.expiryDate || !isFormSubmitted ? undefined : 'error'}
            helpText={GrantWalletInput.expiryDate || !isFormSubmitted ? undefined : 'Required'}>
            <DaySelector
              data-testid="expiry-date"
              className="w-60"
              minDate={currentDate}
              value={GrantWalletInput.expiryDate}
              onChangeValue={(newExpiryDate) => {
                setGrantWalletInput((prev) => ({...prev, expiryDate: newExpiryDate}));
              }}
            />
          </FieldContainer>

          <FieldContainer
            label="Tags"
            helpText={tagInputHelpText}
            status={tagInputHelpText ? 'error' : undefined}
            layout="horizontal">
            <MultiInput
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => validateTagInput(e.target.value)}
              data-testid="tags-input"
              values={GrantWalletInput.tag}
              validateBeforeAdd={(value) => validateTagInput(value)}
              onChangeValues={(newtag) => {
                setGrantWalletInput((prev) => ({...prev, tag: newtag}));
              }}
            />
          </FieldContainer>

          <TextareaField
            data-testid="message-input"
            label="Description"
            layout="horizontal"
            className="w-60 mt-5 relative"
            placeholder="Enter Description"
            value={GrantWalletInput.message}
            status={GrantWalletInput.message || !isFormSubmitted ? undefined : 'error'}
            helpText={GrantWalletInput.message || !isFormSubmitted ? undefined : 'Required'}
            onChangeValue={(newDescription) => {
              setGrantWalletInput((prev) => ({...prev, message: newDescription}));
            }}
          />
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button
            onClick={onClose}
            variant="outline"
            data-testid="grant-wallet-modal-cancel-button">
            CANCEL
          </Button>
          <Button
            className="ml-3"
            type="submit"
            isLoading={isLoadingGrantWallet}
            variant="primary"
            data-testid="amount-input-submit-button">
            SUBMIT
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
