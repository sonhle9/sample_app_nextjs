import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeading,
  DescItem,
  DescList,
  EditIcon,
  formatDate,
  Modal,
  TextField,
  DataTable as Table,
  usePaginationState,
  PaginationNavigation,
  SectionHeading,
  DropdownSelect,
  FieldContainer,
  DataTableCaption,
} from '@setel/portal-ui';
import {
  useListActions,
  useMemberTiers,
  useReplaceUserTier,
  useUserTierProgress,
} from '../../customers.queries';
import {IUserTierProgress, MembershipTierTitle} from 'src/shared/interfaces/membership.interface';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';

const validityMap = {
  forever: 'Forever',
  end_of_next_month: 'End Of Next Month',
};

interface IReplaceCustomerTierModalProps {
  isOpen: boolean;
  userTierProgress: IUserTierProgress;
  onClose: () => void;
}

export function CustomerMembership({userId}: {userId: string}) {
  return (
    <>
      <SectionHeading className="mb-4" title="Membership" />
      <MembershipDetails userId={userId} />
      <MembershipActions userId={userId} />
    </>
  );
}

function MembershipDetails({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const {data: userTierProgress, isLoading: isLoadingUserTierProgress} = useUserTierProgress(
    userId,
    {enabled: isCardExpand || isEditModalOpen},
  );
  return (
    <>
      {isEditModalOpen && userTierProgress && (
        <MembershipReplaceCustomerTierModal
          isOpen={isEditModalOpen}
          userTierProgress={userTierProgress}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      <Card
        expandable
        data-testid="expand-membership-details"
        className="mb-8"
        isOpen={isCardExpand}
        onToggleOpen={() => setCardExpand((prev) => !prev)}>
        <CardHeading title="Membership details">
          <Button
            variant="outline"
            data-testid="edit-membership-tier-button"
            leftIcon={<EditIcon />}
            minWidth="none"
            onClick={() => setEditModalOpen((prev) => !prev)}>
            EDIT
          </Button>
        </CardHeading>

        <CardContent>
          <DescList isLoading={isLoadingUserTierProgress}>
            <DescItem
              label="Tier"
              value={userTierProgress && userTierProgress?.currentTier.title}
            />
            <DescItem
              label="Progress"
              value={
                userTierProgress && (
                  <>
                    {/* following the logic in angular code */}
                    {userTierProgress.currentTier.requirements.map((requirement, index) => (
                      <div key={'' + requirement.min}>
                        {`${userTierProgress.requirementsProgress[index].value} ${
                          requirement?.max ? 'of ' + requirement.max : ''
                        } ${requirement.unitLabel}`}
                      </div>
                    ))}
                  </>
                )
              }
            />
            <DescItem
              label="Validity"
              value={
                (userTierProgress && validityMap[userTierProgress?.currentTier.validity]) || '-'
              }
            />
            <DescItem
              label="Duration"
              value={
                userTierProgress &&
                `${formatDate(userTierProgress.appliedAt, {formatType: 'dateAndTime'})} - 
            ${
              userTierProgress.expiredAt
                ? formatDate(userTierProgress.expiredAt, {formatType: 'dateAndTime'})
                : 'N/A'
            }`
              }
            />
            <DescItem
              label="Requirement benefit"
              value={
                userTierProgress && (
                  <>
                    {userTierProgress?.currentTier.privileges.map((privilege) => (
                      <div key={privilege.type + privilege.label}>{privilege.label}</div>
                    ))}
                  </>
                )
              }
            />
          </DescList>
        </CardContent>
      </Card>
    </>
  );
}

function MembershipActions({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data: membershipActions, isLoading: isLoadingMemberActions} = useListActions(
    userId,
    {page, perPage},
    {enabled: isCardExpand},
  );
  return (
    <Card
      data-testid="membership-actions-card"
      expandable
      isOpen={isCardExpand}
      onToggleOpen={() => setCardExpand((prev) => !prev)}>
      <CardHeading title="Membership actions" />
      <CardContent>
        <Table
          type="primary"
          isLoading={isLoadingMemberActions}
          pagination={
            membershipActions &&
            isCardExpand &&
            membershipActions.total > 20 && (
              <PaginationNavigation
                total={membershipActions.total}
                currentPage={page}
                perPage={perPage}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="text-right">AMOUNT (POINTS)</Table.Th>
              <Table.Th>TYPE</Table.Th>
              <Table.Th>RELATED DOCUMENT</Table.Th>
              <Table.Th className="text-right">CREATED ON</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {!isLoadingMemberActions &&
            membershipActions &&
            (membershipActions.total ? (
              <Table.Tbody>
                {membershipActions.data.map((membershipAction) => (
                  <Table.Tr key={membershipAction._id}>
                    <Table.Td className="text-right">{membershipAction.amount}</Table.Td>
                    <Table.Td>{membershipAction.type}</Table.Td>
                    <Table.Td>{membershipAction.relatedDocumentId}</Table.Td>
                    <Table.Td className="text-right">
                      {formatDate(membershipAction.createdAt, {formatType: 'dateAndTime'})}
                    </Table.Td>
                  </Table.Tr>
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
      </CardContent>
    </Card>
  );
}

export function MembershipReplaceCustomerTierModal({
  isOpen,
  userTierProgress,
  onClose,
}: IReplaceCustomerTierModalProps) {
  const selectableDropDown = Object.values(MembershipTierTitle).filter(
    (value) => value !== userTierProgress.currentTier.title,
  );
  const [selectedNewTier, setSelectedNewTier] = React.useState('');
  const [isNewTierTouched, setNewTierTouched] = React.useState(false);
  const [pointProgressInput, setPointProgressInput] = React.useState(0);
  const [errorText, setErrorText] = React.useState('');
  const {data: tiers} = useMemberTiers();
  const {
    mutate: mutateUserTier,
    isLoading: isUpdatingUserTier,
    isError: isReplaceUserTierError,
    error: replaceUserTierError,
  } = useReplaceUserTier();

  function handleSelectNewTier(value: string) {
    setSelectedNewTier(value);
    switch (value) {
      case MembershipTierTitle.JUNIOR:
        setPointProgressInput(99);
        break;
      case MembershipTierTitle.EXPLORER:
        setPointProgressInput(279);
        break;
      case MembershipTierTitle.HERO:
        setPointProgressInput(280);
        break;
    }
  }

  React.useEffect(validatePointProgressInput, [pointProgressInput]);

  function validatePointProgressInput() {
    switch (selectedNewTier) {
      case MembershipTierTitle.JUNIOR:
        if (pointProgressInput > 99 || pointProgressInput < 0) {
          setErrorText('Value must be in range [0, 99]');
          return;
        }
        break;
      case MembershipTierTitle.EXPLORER:
        if (pointProgressInput < 100 || pointProgressInput > 279) {
          setErrorText('Value must be in range [100, 279]');
          return;
        }
        break;
      case MembershipTierTitle.HERO:
        if (pointProgressInput < 280) {
          setErrorText('Value must be in range [280, ∞]');
          return;
        }
        break;
    }
    setErrorText('');
  }

  function handleSubmit() {
    if (!!errorText || !selectedNewTier) {
      return;
    }
    tiers &&
      mutateUserTier(
        {
          userId: userTierProgress.userId,
          requestBody: {
            progress: [pointProgressInput],
            tierId: tiers.find((tier) => tier.title === selectedNewTier)._id,
          },
        },
        {onSuccess: onClose},
      );
  }

  return (
    <Modal
      data-testid="replace-member-tier-modal"
      isOpen={isOpen}
      onDismiss={onClose}
      header="Replace customer's tier"
      initialFocus="content">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}>
        <Modal.Body>
          {isReplaceUserTierError && (
            <div className="pb-4">
              <QueryErrorAlert
                error={(replaceUserTierError as any) || null}
                description="Error while replace user tier"
              />
            </div>
          )}
          {/* DescList like component that have the same spacing as TextField */}
          <div className="mb-5">
            <div className="flex items-center">
              <label className="block leading-5 text-mediumgrey text-sm mb-0 pr-3 flex-1">
                Current Tier
              </label>
              <div className="flex-2 lg:flex-3">{userTierProgress?.currentTier.title}</div>
            </div>
          </div>

          <FieldContainer
            className="mt-5"
            label="New tier"
            forceShrink
            status={!isNewTierTouched || selectedNewTier ? undefined : 'error'}
            helpText={!isNewTierTouched || selectedNewTier ? undefined : 'Required'}
            layout="horizontal-responsive">
            <DropdownSelect
              data-testid="select-tier-dropdown"
              className="w-60"
              placeholder="Select any tier"
              value={selectedNewTier}
              onClick={() => setNewTierTouched(true)}
              onChangeValue={(value) => handleSelectNewTier(value)}
              options={selectableDropDown}
            />
          </FieldContainer>

          <TextField
            data-testid="point-textfield"
            status={errorText ? 'error' : undefined}
            helpText={errorText}
            label="Point progress"
            layout="horizontal"
            className="w-60"
            placeholder="Enter point amount"
            type="number"
            value={pointProgressInput}
            onChange={(e) => setPointProgressInput(+e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button onClick={onClose} variant="outline">
            CANCEL
          </Button>
          <Button
            className="ml-3"
            type="submit"
            isLoading={isUpdatingUserTier}
            variant="primary"
            disabled={!!errorText || !selectedNewTier}>
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
