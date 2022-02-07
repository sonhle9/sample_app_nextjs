import * as React from 'react';
import {
  Card,
  DataTable as Table,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandRow,
  usePaginationState,
  PaginationNavigation,
  BadgeProps,
  Badge,
  BareButton,
  formatDate,
  Dialog,
  Button,
  Section,
  DataTableCaption,
} from '@setel/portal-ui';

import {vouchersRole} from 'src/shared/helpers/roles.type';
import {VoucherRedeemType, VoucherStatus} from 'src/shared/interfaces/vouchers.interface';
import {useListUserVouchers, useVoidVoucher} from '../../customers.queries';
import {Link} from 'src/react/routing/link';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {HasPermission} from 'src/react/modules/auth/HasPermission';

export function CustomerVouchers({userId}: {userId: string}) {
  const [isCardOpen, setCardOpen] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [selectedVoucherCode, setSelectedVoucherCode] = React.useState('');
  const {page, perPage, setPage, setPerPage} = usePaginationState();

  const {data: paginatedUserVouchers, isLoading: isLoadingUserVouchers} = useListUserVouchers(
    userId,
    {page, perPage},
    {enabled: isCardOpen},
  );

  return (
    <>
      <HasPermission accessWith={[vouchersRole.view]}>
        {showDialog && (
          <VoidVoucherDialog
            voucherCode={selectedVoucherCode}
            onDismiss={() => setShowDialog(false)}
          />
        )}
        <Section />
        <Table
          heading={<Card.Heading title="Vouchers" data-testid="voucher-card-heading" />}
          expandable
          isOpen={isCardOpen}
          onToggleOpen={() => setCardOpen((prev) => !prev)}
          isLoading={isLoadingUserVouchers}
          type="primary"
          native
          data-testid="voucher-outer-table"
          pagination={
            paginatedUserVouchers &&
            isCardOpen &&
            paginatedUserVouchers.total > 20 && (
              <PaginationNavigation
                total={paginatedUserVouchers.total}
                currentPage={page}
                perPage={perPage}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Td>BATCH Name</Table.Td>
              <Table.Td>STATUS</Table.Td>
              <Table.Td>CODE</Table.Td>
              <Table.Td>REDEEM TYPE</Table.Td>
              <Table.Td className="text-right">ACTION</Table.Td>
            </Table.Tr>
          </Table.Thead>

          {!isLoadingUserVouchers &&
            paginatedUserVouchers &&
            (paginatedUserVouchers.total ? (
              <Table.Tbody>
                {paginatedUserVouchers.items.map((voucher) => (
                  <ExpandGroup key={voucher.code}>
                    <Table.Tr>
                      <Table.Td>
                        <ExpandButton
                          data-testid={`expand-voucher-table-row-button-${voucher._id}`}
                        />
                        {voucher.batchName}
                      </Table.Td>
                      <Table.Td>
                        <Badge className="uppercase" color={statusColor[voucher.status]}>
                          {voucher.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Link to={`/vouchers/${voucher.code}`}>{voucher.code}</Link>
                      </Table.Td>
                      <Table.Td>{redeemTypeLabel[voucher.redeemType]}</Table.Td>
                      <Table.Td className="text-right">
                        {voucher.status !== VoucherStatus.VOIDED && (
                          <HasPermission accessWith={[vouchersRole.void]}>
                            <BareButton
                              onClick={() => {
                                setSelectedVoucherCode(voucher.code);
                                setShowDialog(true);
                              }}
                              className="text-brand-500">
                              VOID VOUCHER
                            </BareButton>
                          </HasPermission>
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <ExpandRow>
                      <div className="-m-5">
                        <Table type="secondary" data-testid="voucher-inner-table">
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Td>NAME</Table.Td>
                              <Table.Td className="text-right">AMOUNT</Table.Td>
                              <Table.Td className="text-right">EXPIRY DATE</Table.Td>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {voucher.rules.map((rule) => (
                              <Table.Tr key={voucher.code + rule._id}>
                                <Table.Td>{rule.name}</Table.Td>
                                <Table.Td className="text-right">{rule.amount}</Table.Td>
                                <Table.Td className="text-right">
                                  {(rule.expiryDate && formatDate(rule.expiryDate)) || '-'}
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </div>
                    </ExpandRow>
                  </ExpandGroup>
                ))}
              </Table.Tbody>
            ) : (
              <DataTableCaption>
                <div className="py-5">
                  <div className="text-center py-5 text-md">
                    <p className="font-normal">You have no data to be displayed here</p>
                  </div>
                </div>
              </DataTableCaption>
            ))}
        </Table>
      </HasPermission>
    </>
  );
}

function VoidVoucherDialog({voucherCode, onDismiss}: {voucherCode: string; onDismiss: () => void}) {
  const cancelRef = React.useRef(null);
  const {mutate: mutateVoidVoucher, isLoading: isVoidingVoucher, error, isError} = useVoidVoucher();

  return (
    <Dialog onDismiss={onDismiss} leastDestructiveRef={cancelRef}>
      <Dialog.Content header="Void voucher">
        {isError && (
          <div className="pb-4">
            <QueryErrorAlert
              error={(error as any) || null}
              description="Error while voiding voucher"
            />
          </div>
        )}
        Are you sure you want to void the voucher?
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="outline" onClick={onDismiss} ref={cancelRef}>
          CANCEL
        </Button>
        <Button
          variant="error"
          isLoading={isVoidingVoucher}
          onClick={() =>
            mutateVoidVoucher(voucherCode, {
              onSuccess: onDismiss,
            })
          }>
          CONFIRM
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

const statusColor: Record<VoucherStatus, BadgeProps['color']> = {
  [VoucherStatus.EXPIRED]: 'error',
  [VoucherStatus.ISSUED]: 'info',
  [VoucherStatus.REDEEMED]: 'success',
  [VoucherStatus.VOIDED]: 'grey',
};

const redeemTypeLabel: Record<VoucherRedeemType, string> = {
  [VoucherRedeemType.EXTERNAL]: 'External',
  [VoucherRedeemType.FUEL]: 'Fuel',
  [VoucherRedeemType.REGISTRATION]: 'Registration',
  [VoucherRedeemType.TOPUP]: 'Top-up',
};
