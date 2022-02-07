import {
  Card,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Filter,
  FilterControls,
  PaginationNavigation,
  Badge,
  Button,
  PlusIcon,
  DropdownMenu,
  DotVerticalIcon,
  EditIcon,
  OrderIcon,
  TrashIcon,
  DragHandle,
  BareButton,
  Tooltip,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {badgeGroupsRoles} from 'src/shared/helpers/roles.type';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {IBadgeGroupInList, I18nString} from '../../badge-campaigns.type';
import {BadgeGroupModal} from './badge-group-modal';
import {useBadgeGroupList} from '../../badge-campaigns.queries';
import {DeleteBadgeGroupModal} from './delete-badge-group-modal';
import {useBadgeGroupBadgeListModal} from './use-badge-group-badge-list-modal';

const StatusColorMap = {VISIBLE: 'success', HIDDEN: 'grey'};

export function BadgeGroupList() {
  const {list, reorderList, resetList, mutateList, isFetching, filter, pagination, total} =
    useBadgeGroupList();
  const pageStartNumber = (pagination.page - 1) * pagination.perPage + 1;

  const [sortable, setSortable] = React.useState(false);
  React.useEffect(() => {
    if (isFetching) setSortable(false);
  }, [isFetching]);

  const [isOpenDetailModal, setIsOpenDetailModal] = React.useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = React.useState(false);
  const [badgeGroup, setBadgeGroup] = React.useState<IBadgeGroupInList>();
  const badgeListByBadgeGroupModal = useBadgeGroupBadgeListModal();

  return (
    <PageContainer
      heading="Badge groups"
      className="space-y-4"
      action={
        <div className="flex">
          {sortable ? (
            <>
              <Button
                variant="primary"
                className="mr-4"
                onClick={mutateList}
                isLoading={isFetching}>
                SAVE CHANGES
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSortable(false);
                  resetList();
                }}
                isLoading={isFetching}>
                CANCEL
              </Button>
            </>
          ) : (
            <>
              <HasPermission accessWith={[badgeGroupsRoles.update]}>
                <Button
                  variant="outline"
                  leftIcon={<OrderIcon />}
                  className="mr-4"
                  onClick={() => setSortable(true)}>
                  RE-ORDER
                </Button>
              </HasPermission>
              <HasPermission accessWith={[badgeGroupsRoles.create]}>
                <Button
                  variant="primary"
                  leftIcon={<PlusIcon />}
                  onClick={() => setIsOpenDetailModal(true)}>
                  CREATE
                </Button>
              </HasPermission>
            </>
          )}
        </div>
      }>
      <HasPermission accessWith={[badgeGroupsRoles.read]}>
        <FilterControls filter={filter}></FilterControls>
        <Filter filter={filter}></Filter>
        <Card className="mb-8">
          <DataTable
            isLoading={isFetching}
            sortable={sortable}
            onSortEnd={reorderList}
            useDragHandle={sortable}
            striped
            pagination={
              <PaginationNavigation
                total={total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            }>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>Priority</Td>
                <Td>Group Name</Td>
                <Td>Status</Td>
                <Td>Description</Td>
                <Td>Total Badge Campaigns</Td>
                <Td />
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {list.map((badgeGroup, index) => (
                <Tr key={badgeGroup.id}>
                  <Td>{pageStartNumber + index}</Td>
                  <Td>{badgeGroup.name}</Td>
                  <Td>
                    <Badge
                      className="tracking-wider font-semibold"
                      rounded="rounded"
                      color={StatusColorMap[(badgeGroup.status ?? '').toUpperCase()]}>
                      {(badgeGroup.status ?? '').toUpperCase()}
                    </Badge>
                  </Td>
                  <Td>{badgeGroup.description}</Td>
                  <Td>
                    {badgeGroup.totalBadgeCampaigns > 0 ? (
                      <Tooltip
                        label={
                          <div className="space-y-1">
                            <ol className="list-decimal list-inside space-y-1">
                              {badgeGroup.badges?.slice(0, 3)?.map((badge, index) => (
                                <li key={index}>
                                  {(badge.content?.title as I18nString)?.en ?? '-'}
                                </li>
                              ))}
                            </ol>
                            {badgeGroup.badges?.length > 3 && <div>+1 more</div>}
                          </div>
                        }>
                        <BareButton
                          className="text-brand-500 text-sm py-1"
                          onClick={() => badgeListByBadgeGroupModal.open(badgeGroup.id)}>
                          {badgeGroup.totalBadgeCampaigns}
                        </BareButton>
                      </Tooltip>
                    ) : (
                      badgeGroup.totalBadgeCampaigns
                    )}
                  </Td>
                  <Td>
                    {sortable ? (
                      <DragHandle />
                    ) : (
                      <DropdownMenu
                        variant="icon"
                        label={
                          <>
                            <span className="sr-only">Actions</span>
                            <DotVerticalIcon className="w-5 h-5 text-gray-500" />
                          </>
                        }>
                        <DropdownMenu.Items className="min-w-32">
                          <HasPermission accessWith={[badgeGroupsRoles.update]}>
                            <DropdownMenu.Item
                              onSelect={() => {
                                setBadgeGroup(badgeGroup);
                                setIsOpenDetailModal(true);
                              }}>
                              <EditIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-black-400">Edit</span>
                            </DropdownMenu.Item>
                          </HasPermission>
                          <HasPermission accessWith={[badgeGroupsRoles.delete]}>
                            <DropdownMenu.Item
                              onSelect={() => {
                                setBadgeGroup(badgeGroup);
                                setIsOpenDeleteModal(true);
                              }}>
                              <TrashIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-black-400">Delete</span>
                            </DropdownMenu.Item>
                          </HasPermission>
                        </DropdownMenu.Items>
                      </DropdownMenu>
                    )}
                  </Td>
                </Tr>
              ))}
            </DataTableRowGroup>
          </DataTable>
          {!isFetching && list.length === 0 && (
            <Card className="w-full flex items-center justify-center py-12">
              No badge groups found
            </Card>
          )}
          {badgeListByBadgeGroupModal.component}
        </Card>
      </HasPermission>
      <BadgeGroupModal
        isOpen={isOpenDetailModal}
        onClose={() => {
          setBadgeGroup(undefined);
          setIsOpenDetailModal(false);
        }}
        badgeGroupId={badgeGroup?.id}
      />
      <DeleteBadgeGroupModal
        id={badgeGroup?.id}
        isOpen={isOpenDeleteModal}
        onClose={() => {
          setBadgeGroup(undefined);
          setIsOpenDeleteModal(false);
        }}
      />
    </PageContainer>
  );
}
