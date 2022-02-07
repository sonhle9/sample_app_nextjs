import {
  Badge,
  Button,
  Card,
  DescItem,
  DescList,
  DropdownMenu,
  formatDate,
  PlusIcon,
  Section,
  SectionHeading,
  titleCase,
  DataTable as Table,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandRow,
  PaginationNavigation,
  usePaginationState,
  BadgeProps,
} from '@setel/portal-ui';
import * as React from 'react';
import {LOYALTY_CARDS_STATUSES} from 'src/app/stations/shared/const-var';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {HasPermission, useHasPermission} from 'src/react/modules/auth/HasPermission';
import {Link} from 'src/react/routing/link';
import {LoyaltyTransactionStatusesEnum} from 'src/shared/enums/loyalty.enum';
import {customerRole, loyaltyRoles} from 'src/shared/helpers/roles.type';
import {maskCardNumber} from '../../customers.helper';
import {
  useGetUnlinkLoyaltyCards,
  useIndexLmsLoyaltyTransactions,
  useIndexUserLoyaltyTransactions,
} from '../../customers.queries';
import {loyaltyCardStatusColor} from '../../customers.type';
import {
  AddLoyaltyCardModal,
  GrantLoyaltyPointsModal,
  UnlinkLoyaltyCardModal,
  UpdateLoyaltyCardModal,
} from './customer-loyalty-modal';
import {useGetCardBalanceByCardNumber, useGetCardsByUserId} from '../../../loyalty/loyalty.queries';
import {useCanReadLoyalty} from 'src/react/modules/loyalty/custom-hooks/use-check-permissions';
import {AxiosError} from 'axios';
import {CardProvider} from 'src/react/modules/loyalty/loyalty.type';

export function CustomerLoyaltySection({
  userId,
  customerName,
}: {
  userId: string;
  customerName: string;
}) {
  const [isGrantPointsModalOpen, setGrantPointsModalOpen] = React.useState(false);
  return (
    <>
      <HasPermission accessWith={[customerRole.read]}>
        {isGrantPointsModalOpen && (
          <GrantLoyaltyPointsModal
            userId={userId}
            isOpen={isGrantPointsModalOpen}
            dismiss={() => setGrantPointsModalOpen(false)}
          />
        )}
        <Section>
          <SectionHeading title="Loyalty">
            <HasPermission accessWith={[customerRole.loyaltyPointsGranting]}>
              <Button
                variant="primary"
                onClick={() => setGrantPointsModalOpen(true)}
                leftIcon={<PlusIcon />}>
                GRANT MESRA POINT
              </Button>
            </HasPermission>
          </SectionHeading>
          <div className="space-y-8">
            <HasPermission accessWith={[loyaltyRoles.adminAccess, loyaltyRoles.viewLoyaltyCards]}>
              <LoyaltyCardDetails userId={userId} customerName={customerName} />
            </HasPermission>
            <LoyaltyCardUnlinkHistory userId={userId} />
            <LoyaltyTransactions userId={userId} />
            <LoyaltyVendorTransactions userId={userId} />
          </div>
        </Section>
      </HasPermission>
    </>
  );
}

function LoyaltyCardDetails({userId, customerName}: {userId: string; customerName: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = React.useState(false);
  const [isUnlinkModalOpen, setUnlinkModalOpen] = React.useState(false);
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);

  const userCanReadRedemptionCapInLoyaltyCardDetails = useCanReadLoyalty();

  const {data: loyaltyCardDetails, isLoading: isLoadingUserLoyaltyCard} =
    useGetCardsByUserId(userId);
  const {data: balances} = useGetCardBalanceByCardNumber(loyaltyCardDetails?.cardNumber, {
    retry: (retryCount, err) => {
      const error = err as AxiosError;
      return retryCount < 3 && error?.response?.status !== 404;
    },
    enabled: userCanReadRedemptionCapInLoyaltyCardDetails,
  });

  return (
    <>
      {isUpdateModalOpen && loyaltyCardDetails && (
        <UpdateLoyaltyCardModal
          isOpen={isUpdateModalOpen}
          dismiss={() => setUpdateModalOpen(false)}
          userId={userId}
          cardNumber={loyaltyCardDetails.cardNumber}
          currentCardStatus={loyaltyCardDetails.status}
          inputFreezeReason={loyaltyCardDetails.freezeReason}
        />
      )}
      {isUnlinkModalOpen && loyaltyCardDetails && (
        <UnlinkLoyaltyCardModal
          isOpen={isUnlinkModalOpen}
          userId={userId}
          customerName={customerName}
          cardNumber={loyaltyCardDetails.cardNumber}
          dismiss={() => setUnlinkModalOpen(false)}
        />
      )}
      {isAddModalOpen && (
        <AddLoyaltyCardModal
          dismiss={() => setAddModalOpen(false)}
          isOpen={isAddModalOpen}
          userId={userId}
        />
      )}

      <Card
        expandable
        className="mb-8"
        isOpen={isCardExpand}
        onToggleOpen={() => setCardExpand((prev) => !prev)}>
        <Card.Heading title="Loyalty card" data-testid="loyalty-card-heading">
          <HasPermission accessWith={[customerRole.loyaltyPointsGranting]}>
            {!isLoadingUserLoyaltyCard && (
              <DropdownMenu variant="outline" label="MANAGE CARD" data-testid="manage-card-button">
                <DropdownMenu.Items>
                  {loyaltyCardDetails && (
                    <DropdownMenu.Item onSelect={() => setUpdateModalOpen(true)}>
                      Update information and status
                    </DropdownMenu.Item>
                  )}

                  {loyaltyCardDetails ? (
                    <DropdownMenu.Item
                      onSelect={() => {
                        setUnlinkModalOpen(true);
                      }}>
                      Unlink Card
                    </DropdownMenu.Item>
                  ) : (
                    <DropdownMenu.Item
                      onSelect={() => {
                        setAddModalOpen(true);
                      }}>
                      Add Card
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Items>
              </DropdownMenu>
            )}
          </HasPermission>
        </Card.Heading>
        <Card.Content>
          {!isLoadingUserLoyaltyCard && !loyaltyCardDetails ? (
            <div className="font-normal text-center mt-5">Loyalty card not found</div>
          ) : (
            <DescList isLoading={isLoadingUserLoyaltyCard}>
              <DescItem
                label="Card details"
                value={
                  loyaltyCardDetails?.cardNumber && (
                    <Link
                      to={
                        loyaltyCardDetails?.provider === 'SETEL'
                          ? `/loyalty/members/${loyaltyCardDetails.id}`
                          : `/accounts/loyalty-cards/${loyaltyCardDetails.id}`
                      }>
                      <img className="h-8 inline" src="/assets/images/logo-card/card-loyalty.png" />

                      <span>{maskCardNumber(loyaltyCardDetails.cardNumber)}</span>
                    </Link>
                  )
                }
              />

              <DescItem
                label="Status"
                value={
                  <Badge
                    color={loyaltyCardStatusColor[loyaltyCardDetails?.status]}
                    className="uppercase">
                    {LOYALTY_CARDS_STATUSES[loyaltyCardDetails?.status] || '-'}
                  </Badge>
                }
              />

              <DescItem
                label="Point balance"
                value={
                  <>
                    {loyaltyCardDetails?.pointBalance >= 0
                      ? `${loyaltyCardDetails?.pointBalance} Mesra points`
                      : '-'}
                  </>
                }
              />
              <DescItem
                label="Redemption cap"
                value={balances && `${balances.pointRedeemableBalance}/15000 points`}
              />
              <DescItem
                label="Created on"
                value={loyaltyCardDetails?.createdAt && formatDate(loyaltyCardDetails.createdAt)}
              />
            </DescList>
          )}
        </Card.Content>
      </Card>
    </>
  );
}

function LoyaltyCardUnlinkHistory({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);

  const userCanReadLoyaltyCardUnlinkHistory = () =>
    useHasPermission([loyaltyRoles.viewLoyaltyCards]);

  const userCanViewLoyaltyCardUnlinkHistory = userCanReadLoyaltyCardUnlinkHistory();

  const {data: unlinkedCards, isLoading} = useGetUnlinkLoyaltyCards(userId, {
    enabled: isCardExpand && userCanViewLoyaltyCardUnlinkHistory,
    retry: (retryCount, err) => {
      const error = err as AxiosError;
      return retryCount < 3 && error?.response?.status !== 404;
    },
  });

  return (
    <HasPermission accessWith={[loyaltyRoles.viewLoyaltyCards]}>
      <Card
        data-testid="loyalty-unlink-history-card"
        expandable
        isOpen={isCardExpand}
        onToggleOpen={() => setCardExpand((prev) => !prev)}>
        <Card.Heading title="Loyalty card unlink history" data-testid="loyalty-unlink-heading" />

        <Table data-testid="loyalty-unlink-table">
          <Table.Thead>
            <Table.Tr>
              <Table.Td className="min-w-32">CARD NUMBER</Table.Td>
              <Table.Td>POINT BALANCE</Table.Td>
              <Table.Td className="text-right">UPDATED ON</Table.Td>
            </Table.Tr>
          </Table.Thead>
          {!isLoading &&
            unlinkedCards &&
            (unlinkedCards.length ? (
              <Table.Tbody>
                {unlinkedCards.map((card) => (
                  <Table.Tr key={card.id}>
                    <Table.Td>
                      <Link
                        to={
                          card?.provider === CardProvider.SETEL
                            ? `/loyalty/members/${card.id}`
                            : `/accounts/loyalty-cards/${card.id}`
                        }>
                        <img
                          className="h-8 inline"
                          src="/assets/images/logo-card/card-loyalty.png"
                        />
                        <span>{maskCardNumber(card.cardNumber)}</span>
                      </Link>
                    </Table.Td>
                    <Table.Td>{card.pointRedeemableBalance || '0'}</Table.Td>
                    <Table.Td className="text-right">{formatDate(card.updatedAt)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            ) : (
              <EmptyDataTableCaption />
            ))}
        </Table>
      </Card>
    </HasPermission>
  );
}

function LoyaltyTransactions({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();

  const userCanViewLoyaltyTransactions = () =>
    useHasPermission([loyaltyRoles.viewPointTransactions]);

  const canViewLoyaltyTransactions = userCanViewLoyaltyTransactions();

  const {isLoading: isLoadingTransactions, data: loyaltyTransactions} =
    useIndexUserLoyaltyTransactions(
      userId,
      {page, perPage},
      {
        enabled: isCardExpand && canViewLoyaltyTransactions,
        retry: (retryCount, err) => {
          const error = err as AxiosError;
          return retryCount < 3 && error?.response?.status !== 404;
        },
      },
    );

  function errorFilter(errMsg, vendorMsg) {
    if (vendorMsg && !vendorMsg.includes('404 - File or directory not found')) {
      const errObj = JSON.parse(vendorMsg);
      return errObj.message || errObj.Message;
    }
    return errMsg;
  }
  return (
    <HasPermission accessWith={[loyaltyRoles.viewPointTransactions]}>
      <Table
        heading={
          <Card.Heading data-testid="loyalty-transactions-card" title="Loyalty transactions" />
        }
        expandable
        isOpen={isCardExpand}
        onToggleOpen={() => setCardExpand((prev) => !prev)}
        isLoading={isLoadingTransactions}
        native
        pagination={
          loyaltyTransactions &&
          isCardExpand &&
          loyaltyTransactions.metadata.totalCount > 20 && (
            <PaginationNavigation
              variant="prev-next"
              total={loyaltyTransactions.metadata.totalCount}
              currentPage={page}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          )
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Td>TITLE</Table.Td>
            <Table.Td>STATUS</Table.Td>
            <Table.Td>POINTS</Table.Td>
            <Table.Td>POINTS BALANCE</Table.Td>
            <Table.Td className="text-right">CREATED ON</Table.Td>
          </Table.Tr>
        </Table.Thead>
        {!isLoadingTransactions &&
        loyaltyTransactions &&
        loyaltyTransactions.metadata.totalCount &&
        loyaltyTransactions.data.length > 0 ? (
          <Table.Tbody>
            {loyaltyTransactions.data.map((txn) => (
              <ExpandGroup key={txn.id}>
                <Table.Tr>
                  <Table.Td className="inline-flex">
                    <ExpandButton data-testid="expand-loyalty-txn-button" />
                    <div className="pt-2">
                      <Link
                        data-testid="loyalty-txn-link"
                        to={`/payments/transactions/loyalty/${txn.id}`}>
                        {txn.title}
                      </Link>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge className="uppercase" color={loyaltyTxnStatusColor[txn.status]}>
                      {txn.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{txn.amount || '-'}</Table.Td>
                  <Table.Td>{txn.receiverBalance || '-'}</Table.Td>
                  <Table.Td className="text-right">{formatDate(txn.createdAt)}</Table.Td>
                </Table.Tr>
                <ExpandRow>
                  <DescList>
                    <DescItem label="Issued by" value={titleCase(txn.issuedBy)} />
                    <DescItem
                      label="Error message"
                      value={errorFilter(txn.failureReason, txn.vendorFailureReason)}
                    />
                  </DescList>
                </ExpandRow>
              </ExpandGroup>
            ))}
          </Table.Tbody>
        ) : (
          <EmptyDataTableCaption content="Customer does not have any loyalty transactions" />
        )}
      </Table>
    </HasPermission>
  );
}

function LoyaltyVendorTransactions({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();

  const userCanViewLoyaltyVendorTransactions = useCanReadLoyalty();

  const {data: lmsLoyaltyTransactions, isLoading} = useIndexLmsLoyaltyTransactions(
    {
      page,
      perPage,
      type: '1',
      userId,
    },
    {
      enabled: isCardExpand && userCanViewLoyaltyVendorTransactions,
      retry: (retryCount, err) => {
        const error = err as AxiosError;

        return retryCount < 3 && error?.response?.status !== 404;
      },
    },
  );
  return (
    <HasPermission accessWith={[loyaltyRoles.adminAccess, loyaltyRoles.viewLoyaltyCards]}>
      <Table
        heading={
          <Card.Heading title="Loyalty vendor transactions" data-testid="loyalty-vendor-txn-card" />
        }
        expandable
        isOpen={isCardExpand}
        onToggleOpen={() => setCardExpand((prev) => !prev)}
        isLoading={isLoading}
        native
        pagination={
          lmsLoyaltyTransactions &&
          isCardExpand &&
          lmsLoyaltyTransactions.total > 20 && (
            <PaginationNavigation
              total={lmsLoyaltyTransactions.total}
              currentPage={page}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          )
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Td>CODE</Table.Td>
            <Table.Td>DESCRIPTION</Table.Td>
            <Table.Td>MERCHANT NAME</Table.Td>
            <Table.Td className="text-right">POINTS</Table.Td>
            <Table.Td className="text-right">UPDATED ON</Table.Td>
          </Table.Tr>
        </Table.Thead>
        {!isLoading &&
          lmsLoyaltyTransactions &&
          (lmsLoyaltyTransactions.total ? (
            <Table.Tbody>
              {lmsLoyaltyTransactions.items.map((txn, index) => (
                // No unique key
                <Table.Tr key={index}>
                  <Table.Td>{txn.transactionCode || '-'}</Table.Td>
                  <Table.Td>{txn.description || '-'}</Table.Td>
                  <Table.Td>{txn.merchName || '-'}</Table.Td>
                  <Table.Td className="text-right">{txn.points}</Table.Td>
                  <Table.Td className="text-right">{formatDate(txn.transactionDate)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          ) : (
            <EmptyDataTableCaption />
          ))}
      </Table>
    </HasPermission>
  );
}

const loyaltyTxnStatusColor: Record<LoyaltyTransactionStatusesEnum, BadgeProps['color']> = {
  [LoyaltyTransactionStatusesEnum.failed]: 'error',
  [LoyaltyTransactionStatusesEnum.pending]: 'warning',
  [LoyaltyTransactionStatusesEnum.successful]: 'success',
} as const;
