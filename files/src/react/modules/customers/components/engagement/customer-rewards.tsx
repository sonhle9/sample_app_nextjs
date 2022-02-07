import {
  Button,
  Card,
  DescItem,
  DescList,
  JsonPanel,
  PlusIcon,
  Section,
  SectionHeading,
  DataTable as Table,
  usePaginationState,
  PaginationNavigation,
  formatDate,
  Modal,
  TextField,
  DataTableCaption,
  Dialog,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandRow,
  DataTableExpandButton as ExpandButton,
  BareButton,
  Badge,
  BadgeProps,
  DaySelector,
  FieldContainer,
  TimeInput,
} from '@setel/portal-ui';
import {AxiosError} from 'axios';
import {endOfYesterday} from 'date-fns';
import * as React from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useNotification} from 'src/react/hooks/use-notification';
import {HasPermission, useHasPermission} from 'src/react/modules/auth/HasPermission';
import {Link} from 'src/react/routing/link';
import {rewardsRole} from 'src/shared/helpers/roles.type';
import {
  GoalStatusesEnum,
  IGoalWithRelations,
  IMember,
} from 'src/shared/interfaces/reward.interface';
import {
  useAddCashbackCampaign,
  useAddReferrer,
  useGetReferrals,
  useGetReferrer,
  useListMemberGoals,
  useRegenerateReferralCode,
  useRewardMemberInfo,
  useUpdateGoal,
} from '../../customers.queries';

export function CustomerRewards({userId}: {userId: string}) {
  const {data: memberInfo, isLoading: isLoadingMemberInfo} = useRewardMemberInfo(userId, {
    enabled: useHasPermission([rewardsRole.admin_rewards_campaign_view]),
  });
  const {mutate: mutateReferralCode, isLoading: isRegeneratingReferralCode} =
    useRegenerateReferralCode();

  const [isAddReferrerCodeModalOpen, setAddReferrerCodeModalOpen] = React.useState(false);
  const [isRegenerateReferrerCodeDialogOpen, setRegenerateReferrerCodeDialogOpen] =
    React.useState(false);

  const cancelRegenerateDialogRef = React.useRef(null);

  return (
    <HasPermission accessWith={[rewardsRole.admin_rewards_campaign_view]}>
      <AddReferrerCodeModal
        userId={userId}
        isOpen={isAddReferrerCodeModalOpen}
        onClose={() => setAddReferrerCodeModalOpen(false)}
        memberInfo={memberInfo}
      />
      {isRegenerateReferrerCodeDialogOpen && (
        <Dialog
          onDismiss={() => setRegenerateReferrerCodeDialogOpen(false)}
          leastDestructiveRef={cancelRegenerateDialogRef}>
          <Dialog.Content header="Are you sure want to regenerate referral code?" />
          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => setRegenerateReferrerCodeDialogOpen(false)}
              ref={cancelRegenerateDialogRef}>
              CANCEL
            </Button>
            <Button
              variant="error"
              onClick={() =>
                mutateReferralCode(userId, {
                  onSuccess: () => setRegenerateReferrerCodeDialogOpen(false),
                })
              }>
              CONFIRM
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
      <Section>
        <SectionHeading title="Rewards">
          <HasPermission accessWith={[rewardsRole.admin_rewards_member_assign_referrer_code]}>
            {memberInfo?.referrerCode ? null : (
              <Button
                variant="primary"
                onClick={() => setAddReferrerCodeModalOpen(true)}
                leftIcon={<PlusIcon />}
                isLoading={isRegeneratingReferralCode}
                minWidth="none">
                ADD REFERER CODE
              </Button>
            )}
          </HasPermission>
        </SectionHeading>
        <>
          <Card data-testid="member-info-card" className="mb-8" expandable>
            <Card.Heading title="Member info" data-testid="member-card-heading">
              <Button
                variant="outline"
                minWidth="none"
                onClick={() => setRegenerateReferrerCodeDialogOpen(true)}>
                REGENERATE REFERRAL CODE
              </Button>
            </Card.Heading>

            <Card.Content>
              <DescList isLoading={isLoadingMemberInfo}>
                <DescItem label="Referral code" value={memberInfo && memberInfo.referralCode} />
                {memberInfo?.previousReferralCode && (
                  <DescItem label="Previous code" value={memberInfo.previousReferralCode} />
                )}

                <DescItem
                  label="Referrer code"
                  value={memberInfo?.referrerCode ? memberInfo.referrerCode : '-'}
                />
                <DescItem
                  label="Referral registration count"
                  value={memberInfo && memberInfo.referralStat.registered}
                />
                <DescItem
                  label="Referral fuel purchase count"
                  value={memberInfo && memberInfo.referralStat.purchased}
                />
              </DescList>
            </Card.Content>
          </Card>
          <JsonPanel allowToggleFormat json={Object.assign({...memberInfo})} />
        </>
      </Section>
      <Section />
      <div className="space-y-8">
        <ReferralsCard userId={userId} />
        <ReferrerCard userId={userId} />
        <GoalsCard userId={userId} />
      </div>
    </HasPermission>
  );
}

interface AddReferrerModalProps {
  userId: string;
  onClose: () => void;
  isOpen: boolean;
  memberInfo: IMember;
}

function AddReferrerCodeModal({userId, isOpen, onClose, memberInfo}: AddReferrerModalProps) {
  const [referrerCode, setReferrerCode] = React.useState('');
  const {mutate: mutateReferrer, isLoading} = useAddReferrer();
  const [errorText, setErrorText] = React.useState('');

  function handleSubmit() {
    if (isInvalidInput) {
      return;
    }
    mutateReferrer(
      {userId, referrerCode},
      {onSuccess: onClose, onError: (err: AxiosError) => setErrorText(err?.response.data?.message)},
    );
  }
  const isInvalidInput =
    referrerCode.length < 4 ||
    referrerCode === memberInfo?.referralCode ||
    referrerCode === memberInfo?.previousReferralCode;

  function handleReferrerCodeInputChange(referrerCodeInput: string) {
    setReferrerCode(referrerCodeInput);
    if (
      referrerCodeInput === memberInfo?.referralCode ||
      referrerCodeInput === memberInfo?.previousReferralCode
    ) {
      setErrorText(`Referrer code can't be the same as referral code`);
    } else {
      setErrorText('');
    }
  }
  return (
    <Modal
      size="small"
      isOpen={isOpen}
      onDismiss={onClose}
      aria-label="information"
      header="Add referrer code">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}>
        <Modal.Body>
          <TextField
            status={isInvalidInput || errorText ? 'error' : undefined}
            helpText={errorText}
            autoFocus
            label="Referrer code"
            layout="horizontal"
            className="w-60"
            placeholder="Enter referrer code"
            value={referrerCode}
            onChange={(e) => handleReferrerCodeInputChange(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button onClick={onClose} variant="outline">
            CANCEL
          </Button>
          <Button
            className="ml-3"
            disabled={isInvalidInput}
            isLoading={isLoading}
            type="submit"
            variant="primary">
            SAVE
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

function ReferralsCard({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data: referrals, isLoading: isLoadingReferrals} = useGetReferrals(
    userId,
    {page, perPage},
    {enabled: isCardExpand},
  );

  return (
    <Table
      heading={<Card.Heading title="Referrals" data-testid="referrals-card-heading" />}
      expandable
      data-testid="referrals-table"
      isOpen={isCardExpand}
      isLoading={isLoadingReferrals}
      skeletonRowNum={3}
      onToggleOpen={() => setCardExpand((prev) => !prev)}
      pagination={
        referrals &&
        isCardExpand &&
        referrals.headers['x-total-count'] > 20 && (
          <PaginationNavigation
            total={referrals.headers['x-total-count']}
            currentPage={page}
            perPage={perPage}
            onChangePage={setPage}
            onChangePageSize={setPerPage}
          />
        )
      }>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>FULL NAME</Table.Td>
          <Table.Td>PHONE NUMBER</Table.Td>
          <Table.Td>EMAIL</Table.Td>
          <Table.Td className="text-right">FUEL PURCHASED</Table.Td>
          <Table.Td className="text-right">CREATED ON</Table.Td>
        </Table.Tr>
      </Table.Thead>
      {isLoadingReferrals ? null : (
        <>
          {referrals?.items?.length !== 0 ? (
            <Table.Tbody>
              {referrals?.items.map((referral) => (
                <Table.Tr key={referral.id}>
                  <Table.Td>
                    <Link to={`/customers/${referral.id}?tabIndex=0`}>{referral.name}</Link>
                  </Table.Td>
                  <Table.Td>{referral.phone}</Table.Td>
                  <Table.Td>{referral.email}</Table.Td>
                  <Table.Td className="text-right">
                    {referral.fuelPurchased ? 'Yes' : 'No'}
                  </Table.Td>
                  <Table.Td className="text-right">{formatDate(referral.createdAt)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          ) : (
            <DataTableCaption>
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No data available.</p>
              </div>
            </DataTableCaption>
          )}
        </>
      )}
    </Table>
  );
}

function ReferrerCard({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const {isLoading: isLoadingReferrer, data: referrer} = useGetReferrer(userId, {
    enabled: isCardExpand,
  });
  return (
    <Table
      heading={<Card.Heading title="Referrer" data-testid="referrer-card-heading" />}
      expandable
      data-testid="referrer-table"
      isOpen={isCardExpand}
      isLoading={isLoadingReferrer}
      skeletonRowNum={1}
      onToggleOpen={() => setCardExpand((prev) => !prev)}>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>FULL NAME</Table.Td>
          <Table.Td>PHONE NUMBER</Table.Td>
          <Table.Td>EMAIL</Table.Td>
          <Table.Td>REFERRAL CODE</Table.Td>
          <Table.Td className="text-right">CREATED ON</Table.Td>
        </Table.Tr>
      </Table.Thead>

      {referrer ? (
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>
              <Link to={`/customers/${referrer.id}?tabIndex=0`}>{referrer.name}</Link>
            </Table.Td>
            <Table.Td>{referrer.phone}</Table.Td>
            <Table.Td>{referrer.email}</Table.Td>
            <Table.Td>{referrer.referralCode}</Table.Td>
            <Table.Td className="text-right">{formatDate(referrer.createdAt)}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      ) : (
        <DataTableCaption>
          <div className="py-12">
            <p className="text-center text-gray-400 text-sm">No data available.</p>
          </div>
        </DataTableCaption>
      )}
    </Table>
  );
}

function GoalsCard({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data: memberGoals, isLoading: isLoadingMemberGoals} = useListMemberGoals(
    userId,
    {page, perPage},
    {enabled: isCardExpand},
  );

  const [selectedGoal, setSelectedGoal] = React.useState<IGoalWithRelations>();

  const isValidEndDate = selectedGoal?.endDate > new Date().toISOString();

  const {
    mutate: mutateGoal,
    isLoading: isUpdatingGoal,
    isError: isUpdateGoalError,
    error: updateGoalError,
    reset,
  } = useUpdateGoal();

  function dismissUpdateGoalModal() {
    setEditModalOpen(false);
    reset();
  }

  const {mutate: addCashbackCampaign, isLoading: isAddingCashbackCampaign} =
    useAddCashbackCampaign();
  const showMessage = useNotification();

  return (
    <>
      {isEditModalOpen && selectedGoal && (
        <Modal
          data-testid="edit-end-date-modal"
          header="Edit details"
          isOpen={isEditModalOpen}
          onDismiss={dismissUpdateGoalModal}>
          <Modal.Body>
            {isUpdateGoalError && (
              <div className="pb-4">
                <QueryErrorAlert
                  error={(updateGoalError as any) || null}
                  description="Error while updating goal"
                />
              </div>
            )}
            <FieldContainer label="End date" layout="horizontal-responsive">
              <DaySelector
                data-testid="input-end-date"
                minDate={endOfYesterday()}
                value={new Date(selectedGoal.endDate)}
                onChangeValue={(e) =>
                  setSelectedGoal((prev) => ({...prev, endDate: e.toISOString()}))
                }
              />
            </FieldContainer>
            <FieldContainer
              label="End time"
              layout="horizontal-responsive"
              status={isValidEndDate ? undefined : 'error'}
              helpText={isValidEndDate ? undefined : 'End Date cannot smaller than start date'}>
              <TimeInput
                data-testid="input-end-time"
                hours={new Date(selectedGoal.endDate).getHours()}
                minutes={new Date(selectedGoal.endDate).getMinutes()}
                onChangeValue={({hours, minutes}) =>
                  setSelectedGoal((prev) => ({
                    ...prev,
                    endDate: new Date(
                      new Date(prev.endDate).setHours(hours, minutes),
                    ).toISOString(),
                  }))
                }
              />
            </FieldContainer>
          </Modal.Body>
          <Modal.Footer className="text-right">
            <Button onClick={dismissUpdateGoalModal} variant="outline">
              CANCEL
            </Button>
            <Button
              disabled={!isValidEndDate}
              className="ml-3"
              onClick={() =>
                mutateGoal(selectedGoal, {
                  onSuccess: () => {
                    setEditModalOpen(false);
                    showMessage({
                      title: `Successful!`,
                      variant: 'success',
                      description: 'End date updated',
                    });
                  },
                  onError: (err: AxiosError) => {
                    showMessage({
                      title: err?.message || err?.response?.data?.message,
                      variant: 'error',
                    });
                  },
                })
              }
              isLoading={isUpdatingGoal}
              variant="primary">
              SAVE CHANGES
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Table
        data-testid="goals-table"
        heading={
          <Card.Heading title="Goals" data-testid="goals-card-heading">
            <HasPermission accessWith={[rewardsRole.admin_rewards_campaign_create_rebate]}>
              <Button
                variant="outline"
                onClick={() =>
                  addCashbackCampaign(userId, {
                    onSuccess: () => {
                      showMessage({
                        variant: 'success',
                        title: `Goal created`,
                      });
                    },
                    onError: (err: AxiosError) => {
                      showMessage({
                        variant: 'error',
                        title: err?.response?.data?.message || err?.message,
                      });
                    },
                  })
                }
                leftIcon={<PlusIcon />}
                isLoading={isAddingCashbackCampaign}
                minWidth="none">
                ADD 10% CASHBACK CAMPAIGN
              </Button>
            </HasPermission>
          </Card.Heading>
        }
        pagination={
          memberGoals &&
          isCardExpand &&
          memberGoals.headers['x-total-count'] > 20 && (
            <PaginationNavigation
              total={memberGoals.headers['x-total-count']}
              currentPage={page}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          )
        }
        expandable
        isOpen={isCardExpand}
        isLoading={isLoadingMemberGoals}
        skeletonRowNum={3}
        native
        onToggleOpen={() => setCardExpand((prev) => !prev)}>
        <Table.Thead>
          <Table.Tr>
            <Table.Td>CAMPAIGN NAME</Table.Td>
            <Table.Td>STATUS</Table.Td>
            <Table.Td>GOAL NAME</Table.Td>
            <Table.Td className="text-right">ACTION</Table.Td>
          </Table.Tr>
        </Table.Thead>
        {isLoadingMemberGoals ? null : memberGoals?.items.length === 0 ? (
          <DataTableCaption>
            <div className="py-12">
              <p className="text-center text-gray-400 text-sm">No data available.</p>
            </div>
          </DataTableCaption>
        ) : (
          <Table.Tbody>
            {memberGoals &&
              memberGoals?.items.map((goal) => (
                <ExpandGroup key={goal.id}>
                  <Table.Tr>
                    <Table.Td>
                      <ExpandButton />
                      <Link to={`/customers/goals/${goal.id}`} className="inline">
                        {goal.campaign ? goal.campaign.name : 'Campaign has been deleted'}
                      </Link>
                    </Table.Td>
                    <Table.Td className="uppercase">
                      <Badge color={goalStatusColorMap[goal.status]}>{goal.status}</Badge>
                    </Table.Td>
                    <Table.Td>{goal.title}</Table.Td>
                    <Table.Td className="text-right">
                      {goal.endDate && (
                        <HasPermission
                          accessWith={[rewardsRole.admin_rewards_goal_extend_rebate_end_date]}>
                          <BareButton
                            onClick={() => {
                              setSelectedGoal(goal);
                              setEditModalOpen(true);
                            }}
                            className="text-brand-500">
                            EDIT DETAILS
                          </BareButton>
                        </HasPermission>
                      )}
                    </Table.Td>
                  </Table.Tr>

                  <ExpandRow>
                    <DescList>
                      <DescItem label="Created on" value={formatDate(goal.createdAt)} />
                      <DescItem
                        label="Ended on"
                        value={goal?.endDate ? formatDate(goal.endDate) : '-'}
                      />
                    </DescList>
                  </ExpandRow>
                </ExpandGroup>
              ))}
          </Table.Tbody>
        )}
      </Table>
    </>
  );
}

const goalStatusColorMap: Record<GoalStatusesEnum, BadgeProps['color']> = {
  [GoalStatusesEnum.active]: 'success',
  [GoalStatusesEnum.completed]: 'grey',
  [GoalStatusesEnum.expired]: 'error',
  [GoalStatusesEnum.exhausted]: 'warning',
};
