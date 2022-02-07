import * as React from 'react';
import {
  Badge,
  BadgeProps,
  Button,
  Card,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DotVerticalIcon,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItems,
  formatDate,
  PaginationNavigation,
  PlusIcon,
  positionRight,
  usePaginationState,
} from '@setel/portal-ui';
import {useRouter} from 'src/react/routing/routing.context';
import {useGetAdjustmentRequest} from '../card.queries';
import {EApprovalRequestsStatus} from '../../approval-requests/approval-requests.enum';
import {AdjustmentDetailsModal} from './card-adjustment-modal';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {HasPermission} from '../../auth/HasPermission';
import {cardRole} from 'src/shared/helpers/roles.type';
import {EAdjustmentType} from '../card.type';

function changeAdjustmentType(type: EAdjustmentType) {
  switch (type) {
    case EAdjustmentType.GRANT:
      return 'Grants card balance (CR)';
    case EAdjustmentType.REVOKE:
      return 'Revoke card balance (DR)';
    default:
      return '';
  }
}

export const ColorMap: Record<EApprovalRequestsStatus, BadgeProps['color']> = {
  [EApprovalRequestsStatus.CANCELLED]: 'grey',
  [EApprovalRequestsStatus.VERIFIED]: 'blue',
  [EApprovalRequestsStatus.APPROVED]: 'success',
  [EApprovalRequestsStatus.REJECTED]: 'error',
  [EApprovalRequestsStatus.PENDING]: 'lemon',
  [EApprovalRequestsStatus.FAILED]: 'grey',
  [EApprovalRequestsStatus.PROCESSING]: 'grey',
};

interface ITransferRequestProps {
  cardNumber: string;
  className?: string;
  cardId?: string;
}

const CardAdjustmentDetails: React.VFC<ITransferRequestProps> = (props) => {
  const router = useRouter();
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data: adjustmentRequestList} = useGetAdjustmentRequest({
    page,
    perPage,
    cardNumber: props.cardNumber,
  });
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [adjustmentRequest, setAdjustmentRequest] = React.useState(null);
  return (
    <>
      <div className={props.className || ''}>
        <div className="grid gap-4 max-w-6xl">
          <Card>
            <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
              <div className="flex items-center capitalize">Adjustment</div>
              <HasPermission accessWith={[cardRole.adjustment]}>
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
            <DataTable
              striped
              // isLoading={isLoading}
              pagination={
                adjustmentRequestList &&
                !!adjustmentRequestList.adjustment.length && (
                  <PaginationNavigation
                    total={adjustmentRequestList.totalDocs}
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
                  <Td className="w-3/12">Adjustment type</Td>
                  <Td className="w-2/12">Created on</Td>
                  <Td className="text-right pr-8">Action</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup groupType="tbody">
                {(adjustmentRequestList?.adjustment || []).map((item, index) => {
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
                      <Td>
                        {item?.rawRequest.adjustmentType &&
                          changeAdjustmentType(item.rawRequest.adjustmentType)}
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
                                    `/card-issuing/card-transactions/${item.rawRequest.transactionUid}`,
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
                                    setAdjustmentRequest(item);
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
              {!adjustmentRequestList?.adjustment.length && (
                <DataTableCaption>
                  <div>
                    <p className="w-full flex items-center justify-center py-12 text-sm">
                      No adjustment request found
                    </p>
                  </div>
                </DataTableCaption>
              )}
            </DataTable>
          </Card>
        </div>
      </div>
      {visibleModal && (
        <AdjustmentDetailsModal
          visible={visibleModal}
          onClose={() => {
            setVisibleModal(false);
            setAdjustmentRequest(null);
          }}
          adjustment={adjustmentRequest}
          cardId={props.cardId}
        />
      )}
    </>
  );
};

export default CardAdjustmentDetails;
