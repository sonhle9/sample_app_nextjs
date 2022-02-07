import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  DataTableCaption,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  formatDate,
  PaginationNavigation,
  PlusIcon,
  usePaginationState,
  DropdownMenu,
  DotVerticalIcon,
  DropdownMenuItems,
  positionRight,
  DropdownItem,
} from '@setel/portal-ui';
import {useRouter} from 'src/react/routing/routing.context';
import {useGetTransferRequest} from '../card.queries';
import {EApprovalRequestsStatus} from '../../approval-requests/approval-requests.enum';
import {ETransferType} from '../card.type';
import {TransferDetailsModal} from './card-transfer-modal';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {HasPermission} from '../../auth/HasPermission';
import {cardRole} from 'src/shared/helpers/roles.type';
import {ColorMap} from './card-adjustment-details';

function changeShowTransferType(type: ETransferType) {
  switch (type) {
    case ETransferType.GRANT:
      return 'Grants card balance (CR)';
    case ETransferType.REVOKE:
      return 'Revoke card balance (DR)';
    default:
      return '-';
  }
}

interface ITransferRequestProps {
  cardNumber: string;
  className?: string;
  cardId?: string;
}

const CardTransferDetails: React.VFC<ITransferRequestProps> = (props) => {
  const router = useRouter();
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data: transferRequestList} = useGetTransferRequest({
    page,
    perPage,
    cardNumber: props.cardNumber,
  });
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [transferRequest, setTransferRequest] = React.useState(null);
  return (
    <>
      <div className={props.className || ''}>
        <div className="grid gap-4 max-w-6xl">
          <Card>
            <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
              <div className="flex items-center capitalize">Transfer</div>
              <HasPermission accessWith={[cardRole.transfer]}>
                <Button
                  variant="outline"
                  leftIcon={<PlusIcon />}
                  onClick={() => {
                    setVisibleModal(true);
                  }}>
                  CREATE
                </Button>
              </HasPermission>
            </div>
            <Table
              striped
              // isLoading={isLoading}
              pagination={
                transferRequestList &&
                !!transferRequestList.transfer.length && (
                  <PaginationNavigation
                    total={transferRequestList.totalDocs}
                    currentPage={page}
                    perPage={perPage}
                    onChangePage={setPage}
                    onChangePageSize={setPerPage}
                  />
                )
              }>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td className="w-2/12 text-right">Amount (RM)</Td>
                  <Td className="w-2/12">Approval status</Td>
                  <Td className="w-3/12">Transfer type</Td>
                  <Td className="w-2/12">Created on</Td>
                  <Td className="text-right pr-8">Action</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup groupType="tbody">
                {(transferRequestList?.transfer || []).map((item, index) => {
                  return (
                    <Tr key={index}>
                      <Td className="text-right">
                        {(item.amount && convertToSensitiveNumber(item.amount)) || '-'}
                      </Td>
                      <Td>
                        {
                          <Badge
                            className="tracking-wider font-semibold uppercase pt-1"
                            rounded="rounded"
                            color={(item.status && ColorMap[item.status]) || 'grey'}
                            style={{width: 'fit-content'}}>
                            {(item && item.status) || 'none'}
                          </Badge>
                        }
                      </Td>
                      <Td className="capitalize ">
                        {item?.rawRequest.transferType &&
                          changeShowTransferType(item.rawRequest.transferType)}
                      </Td>
                      <Td>
                        {item.createdAt &&
                          formatDate(item.createdAt, {
                            formatType: 'dateAndTime',
                          })}
                      </Td>
                      <Td className="text-right">
                        <DropdownMenu
                          variant="icon"
                          className="p-0 align-middle"
                          label={<DotVerticalIcon className="w-5 h-5 text-gray-500 mr-4" />}>
                          <DropdownMenuItems getPosition={positionRight}>
                            <DropdownItem
                              onSelect={() => {
                                if (
                                  item.status === EApprovalRequestsStatus.PENDING ||
                                  item.status === EApprovalRequestsStatus.VERIFIED
                                ) {
                                  router.navigateByUrl(`approvals/approval-requests/${item.id}`);
                                }

                                if (
                                  item.status === EApprovalRequestsStatus.APPROVED ||
                                  item.status === EApprovalRequestsStatus.CANCELLED ||
                                  item.status === EApprovalRequestsStatus.REJECTED
                                ) {
                                  router.navigateByUrl(
                                    `card-issuing/card-transactions/${item.rawRequest.transactionUid}`,
                                  );
                                }
                              }}>
                              <span className="text-black	">View details</span>
                            </DropdownItem>
                            {item.isAccess &&
                              (item.status === EApprovalRequestsStatus.PENDING ||
                                item.status === EApprovalRequestsStatus.VERIFIED) && (
                                <DropdownItem
                                  onSelect={() => {
                                    setTransferRequest(item);
                                    setVisibleModal(true);
                                  }}>
                                  <span className="text-error-500">Cancel request</span>
                                </DropdownItem>
                              )}
                          </DropdownMenuItems>
                        </DropdownMenu>
                      </Td>
                    </Tr>
                  );
                })}
              </DataTableRowGroup>

              {!transferRequestList?.transfer.length && (
                <DataTableCaption>
                  <div>
                    <p className="w-full flex items-center justify-center py-12 text-sm">
                      No transfer request found
                    </p>
                  </div>
                </DataTableCaption>
              )}
            </Table>
          </Card>
        </div>
      </div>
      {visibleModal && (
        <TransferDetailsModal
          visible={visibleModal}
          onClose={() => {
            setVisibleModal(false);
            setTransferRequest(null);
          }}
          transfer={transferRequest}
          cardId={props.cardId}
        />
      )}
    </>
  );
};

export default CardTransferDetails;
