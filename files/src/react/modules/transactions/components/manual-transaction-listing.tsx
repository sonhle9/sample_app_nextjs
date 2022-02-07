import {
  classes,
  Button,
  Card,
  EditIcon,
  Field,
  Label,
  Text,
  DataTable as Table,
  FieldContainer,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  PlusIcon,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DropdownMenu,
  DotVerticalIcon,
  TrashIcon,
  Modal,
  ModalBody,
  ModalFooter,
  formatMoney,
} from '@setel/portal-ui';
import dateFormat from 'date-fns/format';
import moment from 'moment';
import * as React from 'react';
import {useQueryParams, useRouter} from 'src/react/routing/routing.context';
import {HasPermission} from '../../auth/HasPermission';
import {cardTransactionRole} from 'src/shared/helpers/roles.type';
// import {Link} from 'src/react/routing/link';
import {TransactionManualCreateModal} from './transaction-manual-create-modal';
import {TransactionManualMerchantModal} from './transaction-manual-merchant-modal';
import {useMerchantDetails} from '../../merchants/merchants.queries';
import {useState} from 'react';
import {useGetLoyaltyCategories, useSetSettlementBatch} from '../transaction.queries';
import {useNotification} from 'src/react/hooks/use-notification';

export const ManualTransactionListing = () => {
  const activated = useQueryParams();

  return activated ? (
    <ManualTransactionList
      merchant={activated.params.merchant}
      terminal={activated.params.terminal}
    />
  ) : null;
};
export const ManualTransactionList = (props) => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [cancelVisibleModal, setVisibleCancelModal] = React.useState(false);
  const [saveVisibleModal, setVisibleSaveModal] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [visibleModalMerchant, setVisibleModalMerchant] = React.useState(false);
  const {data: merchant} = useMerchantDetails(props.merchant);
  const [newTransactions, setNewTransactions] = React.useState<any[any]>([]);
  const [initialCard, setInitialCard] = useState<any | undefined>();
  const [indexEditor, setIndexEditor] = useState<number>();
  const [transactionAmount, setTransactionAmount] = React.useState(0.0);
  const [transactionNumber, setTransactionNumber] = React.useState(0);
  const router = useRouter();
  const {mutate: setSettlementBatch} = useSetSettlementBatch();
  const setNotify = useNotification();
  const {data: loyaltyCategories} = useGetLoyaltyCategories();

  const onCreateTransaction = (transaction) => {
    setNewTransactions((transactions) => [...transactions, transaction]);
  };
  const onEditTransaction = (transaction, i) => {
    setIndexEditor(i);
    setInitialCard(transaction);
    setVisibleModal(true);
  };

  const isEmptyTransaction = React.useMemo(() => {
    return newTransactions.length === 0;
  }, [newTransactions.length]);

  const onUpdateTransaction = (transaction) => {
    if (indexEditor || indexEditor === 0) {
      newTransactions[indexEditor] = transaction;
      setNewTransactions(newTransactions);
      setIndexEditor(undefined);
      setInitialCard(undefined);
    }
  };

  const onSubmit = () => {
    const data = {
      transactions: newTransactions,
      transactionSource: 'ipt_opt',
      transactionAmount: transactionAmount,
      stan: '000000',
      txLocalTime: moment(new Date()).format('HHmmss'),
      txLocalDate: moment(new Date()).format('MMDD'),
      posEntryMode: '',
      posConditionCode: '',
      rrn: '',
      authIdResponse: '',
      terminalId: props.terminal,
      driverInfo: {
        cardPan: '',
        autoMeterMileageReading: '',
      },
      settlementBatchId: '',
      merchantId: merchant?.merchantId || '',
      isoTransactionType: 'settlement',
    };

    setSettlementBatch(data, {
      onSuccess(res) {
        setVisibleSaveModal(false);
        if (res.responseCode !== '00') {
          setNotify({
            title: 'Error!',
            variant: 'error',
            description: 'Settlement batch create failed',
          });
        } else {
          setNotify({
            title: 'Successful!',
            variant: 'success',
            description: 'Settlement batch created',
          });
          router.navigateByUrl('/card-issuing/card-transactions?tab=1');
        }
      },
      onError() {
        setVisibleSaveModal(false);
        setNotify({
          title: 'Error!',
          variant: 'error',
          description: 'Settlement batch create failed',
        });
      },
    });
  };
  return (
    <>
      <HasPermission accessWith={[cardTransactionRole.view]}>
        <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
            <h1 className={classes.h1}>Settlement batch</h1>
            <div>
              <Button
                variant="error-outline"
                className="align-bottom ml-3"
                minWidth="none"
                onClick={() => {
                  setVisibleCancelModal(true);
                }}>
                CANCEL
              </Button>
              <HasPermission accessWith={[cardTransactionRole.view]}>
                <Button
                  variant="primary"
                  minWidth="none"
                  className="align-bottom ml-3"
                  disabled={isEmptyTransaction}
                  onClick={() => {
                    setTransactionAmount(0);
                    setTransactionNumber(0);
                    if (newTransactions.length > 1) {
                      const reducer = (previousValue, currentValue) =>
                        previousValue.transactionAmount - 0 + (currentValue.transactionAmount - 0);
                      setTransactionAmount((state) => {
                        let newState = state;
                        newState = newTransactions.reduce(reducer);
                        return newState;
                      });

                      const reducerNumber = () => 1 + 1;
                      setTransactionNumber((state) => {
                        let newState = state;
                        newState = newTransactions.reduce(reducerNumber);
                        return newState;
                      });
                    } else {
                      setTransactionAmount(newTransactions[0].transactionAmount);
                      setTransactionNumber(newTransactions.length);
                    }

                    setVisibleSaveModal(true);
                  }}>
                  SAVE
                </Button>
              </HasPermission>
            </div>
          </div>
          <Card>
            <Card.Heading title="Merchant details">
              <Button
                variant="outline"
                leftIcon={<EditIcon />}
                minWidth="none"
                onClick={() => {
                  setVisibleModalMerchant(true);
                }}>
                EDIT
              </Button>
            </Card.Heading>
            <Card.Content>
              <Field className="flex flex-col space-y-4 py-2">
                <Field className="flex">
                  <Label className="w-1/5">Merchant</Label>
                  <Text className="flex-1 text-sm">
                    {merchant?.name + ' - ' + merchant?.merchantId}
                  </Text>
                </Field>
                <Field className="flex">
                  <Label className="w-1/5">Terminal</Label>
                  <Text className="flex-1 text-sm">
                    <span>{props.terminal}</span>
                  </Text>
                </Field>
              </Field>
            </Card.Content>
          </Card>

          <Card>
            <Card.Heading title="List of transactions">
              {newTransactions.length !== 0 && (
                <Button
                  variant="outline"
                  leftIcon={<PlusIcon />}
                  minWidth="none"
                  onClick={() => {
                    setInitialCard(undefined);
                    setStep(0);
                    setVisibleModal(true);
                  }}>
                  ADD
                </Button>
              )}
            </Card.Heading>

            {newTransactions.length === 0 && (
              <Card.Content>
                <div className="max-w-xs mx-auto space-y-4 text-center">
                  <p className="text-sm">You have not added any transactions yet.</p>
                  <Button
                    variant="outline"
                    leftIcon={<PlusIcon />}
                    minWidth="none"
                    onClick={() => {
                      setInitialCard(undefined);
                      setStep(0);
                      setVisibleModal(true);
                    }}>
                    ADD TRANSACTION
                  </Button>
                </div>
              </Card.Content>
            )}

            {newTransactions.length !== 0 && (
              <Table native>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td className="pl-7">No. of itemised transaction</Td>
                    <Td className="text-right">amount (rm)</Td>
                    <Td>Card number</Td>
                    <Td>transaction on</Td>
                    <Td></Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  {newTransactions.map((transaction, index) => (
                    <ExpandGroup key={index}>
                      <Tr>
                        <Td className="pl-7">
                          <ExpandButton />
                          {transaction?.products?.items?.length}
                        </Td>
                        <Td className="text-right">
                          {formatMoney(transaction?.transactionAmount)}
                        </Td>
                        <Td>{transaction?.cardData?.cardNumber}</Td>
                        <Td>
                          {dateFormat(
                            new Date(transaction?.transactionDateTime),
                            'd MMM yyyy, hh:mm:ss a',
                          )}
                        </Td>
                        <Td>
                          <DropdownMenu
                            variant="icon"
                            label={
                              <>
                                <span className="sr-only"></span>
                                <DotVerticalIcon className="w-5 h-5 text-gray-500" />
                              </>
                            }>
                            <DropdownMenu.Items className="min-w-32">
                              <DropdownMenu.Item
                                onSelect={() => {
                                  setStep(0);
                                  onEditTransaction(transaction, index);
                                }}>
                                <EditIcon className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-black-400">Edit details</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onSelect={() => {
                                  setStep(2);
                                  onEditTransaction(transaction, index);
                                }}>
                                <EditIcon className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-black-400">Add items</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onSelect={() => {
                                  setNewTransactions((state) => {
                                    const newState = [...state];
                                    newState.splice(index, 1);
                                    return newState;
                                  });
                                }}>
                                <TrashIcon className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-black-400">Delete</span>
                              </DropdownMenu.Item>
                            </DropdownMenu.Items>
                          </DropdownMenu>
                        </Td>
                      </Tr>
                      <ExpandableRow className="p-0 border-none ml-3 mr-10">
                        {transaction.products?.items?.length !== 0 &&
                          transaction.isoTransactionType === 'charge' && (
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>loyalty categories</Table.Th>
                                  <Table.Th className="text-right">unit price (rm)</Table.Th>
                                  <Table.Th className="text-right">quantity</Table.Th>
                                  <Table.Th className="text-right">amount (RM)</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {transaction.products?.items?.map((item, i) => (
                                  <Table.Tr key={i}>
                                    <Table.Td>
                                      {
                                        loyaltyCategories.find(
                                          (el) => el.categoryCode === item?.categoryCode,
                                        ).categoryName
                                      }
                                    </Table.Td>
                                    <Table.Td className="text-right">
                                      {formatMoney(item?.unitPrice)}
                                    </Table.Td>
                                    <Table.Td className="text-right">{item?.quantity}</Table.Td>
                                    <Table.Td className="text-right">
                                      {formatMoney(item?.unitPrice * item?.quantity)}
                                    </Table.Td>
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                          )}
                        {transaction.isoTransactionType === 'topup' && (
                          <Table>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th>loyalty categories</Table.Th>
                                <Table.Th className="text-right">unit price (rm)</Table.Th>
                                <Table.Th className="text-right">quantity</Table.Th>
                                <Table.Th className="text-right">amount (RM)</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              <Table.Tr>
                                <Table.Td>-</Table.Td>
                                <Table.Td className="text-right">-</Table.Td>
                                <Table.Td className="text-right">-</Table.Td>
                                <Table.Td className="text-right">-</Table.Td>
                              </Table.Tr>
                            </Table.Tbody>
                          </Table>
                        )}
                      </ExpandableRow>
                    </ExpandGroup>
                  ))}
                </DataTableRowGroup>
              </Table>
            )}
          </Card>
        </div>
      </HasPermission>
      <Modal
        isOpen={saveVisibleModal}
        size="small"
        showCloseBtn={false}
        onDismiss={() => {}}
        aria-label="confirm-cancel"
        data-testid="confirm-remove-merchant-modal">
        <ModalBody className="py-7">
          <Text className={classes.h2}>Are you sure you want to save?</Text>
          <Text className="mt-4">
            Please ensure that all data for this settlement batch is correct before saving as they
            cannot be undone and edited later.
          </Text>
          <Card>
            <Card.Content>
              <FieldContainer label="Merchant" layout="horizontal-responsive">
                <Text>{merchant?.merchantId + ' - ' + merchant?.name}</Text>
              </FieldContainer>
              <FieldContainer label="Terminal ID" layout="horizontal-responsive">
                <Text>{props.terminal}</Text>
              </FieldContainer>
              <FieldContainer label="Total transaction amount" layout="horizontal-responsive">
                <Text>{transactionAmount}</Text>
              </FieldContainer>
              <FieldContainer label="Total number of transaction" layout="horizontal-responsive">
                <Text>{transactionNumber}</Text>
              </FieldContainer>
            </Card.Content>
          </Card>
        </ModalBody>
        <ModalFooter className="text-right">
          <Button className="mr-2" variant="outline" onClick={() => setVisibleSaveModal(false)}>
            CANCEL
          </Button>
          <Button data-testid="btn-confirm" variant="primary" onClick={onSubmit}>
            CONFIRM
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={cancelVisibleModal}
        size="small"
        showCloseBtn={false}
        onDismiss={() => {}}
        aria-label="confirm-cancel"
        data-testid="confirm-remove-merchant-modal">
        <ModalBody className="py-7">
          <Text className={classes.h2}>Are you sure you want to cancel?</Text>
          <Text className="mt-4">
            All data for this settlement batch will not be saved and this action cannot be undone.
          </Text>
        </ModalBody>
        <ModalFooter className="text-right">
          <Button className="mr-2" variant="outline" onClick={() => setVisibleCancelModal(false)}>
            CANCEL
          </Button>
          <Button
            data-testid="btn-confirm"
            variant="primary"
            onClick={() => {
              router.navigateByUrl('/card-issuing/card-transactions?tab=1');
              setVisibleCancelModal(false);
            }}>
            CONFIRM
          </Button>
        </ModalFooter>
      </Modal>

      {visibleModal && (
        <TransactionManualCreateModal
          visible={visibleModal}
          onClose={() => setVisibleModal(false)}
          onCreateTransaction={onCreateTransaction}
          onUpdateTransaction={onUpdateTransaction}
          initialData={initialCard}
          step={step}
          isEditor={!!initialCard}
          indexEditor={indexEditor}
        />
      )}
      {visibleModalMerchant && (
        <TransactionManualMerchantModal
          visible={visibleModalMerchant}
          merchant={merchant}
          terminal={props.terminal}
          onClose={() => setVisibleModalMerchant(false)}
        />
      )}
    </>
  );
};
