import * as React from 'react';
import {
  Card,
  CardHeading,
  CardContent,
  Button,
  DropdownMenu,
  DropdownMenuItems,
  DropdownItem,
  Alert,
  Modal,
  ModalHeader,
  PlusIcon,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableCaption,
  DialogContent,
  DialogFooter,
  Dialog,
} from '@setel/portal-ui';
import {PointRuleField} from '../point-rule-field';
import {maskMesra} from 'src/shared/helpers/mask-helpers';
import {Member, FormFactor} from '../../loyalty-members.type';
import {
  useGetLoyaltyMemberWhitelist,
  useWhitelistLoyaltyMember,
  useUnwhitelistLoyaltyMember,
} from '../../loyalty-members.queries';
import {
  useGetLoyaltyMembers,
  useGetLoyaltyMemberById,
  useGetCardBalanceByCardNumber,
} from '../../loyalty.queries';
import {
  LoyaltyCardConfirmModal,
  LoyaltyCardLinkingModal,
  LinkCardOptions,
} from './loyalty-card-linking-modal';
import {LoyaltyCardUnlinkingModal} from './loyalty-card-unlinking-modal';
import {LoyaltyCardUnlinkHistoryModal} from './loyalty-card-unlink-history-modal';
import {LoyaltyMemberCardGroupModal} from './loyalty-member-card-group-modal';
import {useListCardGroups} from '../../custom-hooks/use-list-card-groups';
import {FraudRules} from '../../loyalty.type';
import {loyaltyMemberRoles} from '../../../../../shared/helpers/roles.type';
import {useCanListCardGroups} from '../../custom-hooks/use-check-permissions';
import {HasPermission} from '../../../auth/HasPermission';
import {environment} from 'src/environments/environment';

export type LoyaltyCardSummaryProps = {
  member?: Member;
};

export const LoyaltyCardSummary: React.VFC<LoyaltyCardSummaryProps> = ({member}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [openLinkModal, setOpenLinkModal] = React.useState<boolean>(false);

  const [openUnlinkModal, setOpenUnlinkModal] = React.useState<boolean>(false);

  const [openUnlinkHistoryModal, setOpenUnlinkHistoryModal] = React.useState<boolean>(false);

  const [openManageCardGroupModal, setOpenManageCardGroupModal] = React.useState<boolean>(false);

  const {data} = useGetLoyaltyMembers(
    {idRef: member?.idRef, idType: member?.idType, excludeEmptyCardNumber: true},
    {enabled: !!member?.idRef && !!member?.cardNumber},
  );

  const {data: memberData, isSuccess} = useGetLoyaltyMemberById(member?.id);

  const {isError: unwhiteListed} = useGetLoyaltyMemberWhitelist({
    loyaltyMemberId: member?.id,
    ruleId: FraudRules.TRANSACTION_AMOUNT,
  });

  const {mutateAsync: whitelistMember} = useWhitelistLoyaltyMember();

  const {mutateAsync: unwhitelistMember} = useUnwhitelistLoyaltyMember();

  const [isExemptionConfirmationOpen, setExemptionConfirmationOpen] = React.useState(false);

  const canAccessCardGroup = useCanListCardGroups();

  const {lookUpId} = useListCardGroups();

  const dialogRef = React.useRef(null);

  const paginatedData = React.useMemo(() => {
    return data?.pages.flatMap((response) => response.data);
  }, [data]);

  return (
    <>
      <MultipleMemberModal
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        members={paginatedData}
      />

      {environment.enableLinkToPhysicalCard ? (
        <LoyaltyCardLinkingModal
          isOpen={openLinkModal}
          onDismiss={() => setOpenLinkModal(false)}
          userId={member?.userId}
        />
      ) : (
        <LoyaltyCardConfirmModal
          isOpen={openLinkModal}
          onDismiss={() => setOpenLinkModal(false)}
          onSuccess={() => setOpenLinkModal(false)}
          option={LinkCardOptions.VIRTUAL}
          userId={member?.userId}
        />
      )}
      <LoyaltyCardUnlinkingModal
        isOpen={openUnlinkModal}
        onDismiss={() => setOpenUnlinkModal(false)}
        member={member}
      />
      <LoyaltyCardUnlinkHistoryModal
        isOpen={openUnlinkHistoryModal}
        onDismiss={() => setOpenUnlinkHistoryModal(false)}
        member={member}
      />
      <LoyaltyMemberCardGroupModal
        isOpen={openManageCardGroupModal}
        onDismiss={() => setOpenManageCardGroupModal(false)}
        member={memberData}
      />
      {isExemptionConfirmationOpen && (
        <Dialog
          onDismiss={() => setExemptionConfirmationOpen(false)}
          leastDestructiveRef={dialogRef}
          style={{marginTop: 200}}>
          <DialogContent header={`Do you want to save this changes?`}>
            You are about to {unwhiteListed ? 'enable' : 'disable'} fraud check exemptions for the
            card. Click save to proceed.
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              ref={dialogRef}
              onClick={() => {
                setExemptionConfirmationOpen(false);
              }}>
              CANCEL
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                setExemptionConfirmationOpen(false);

                if (unwhiteListed) {
                  await Promise.all(
                    Object.values(FraudRules).map((ruleId) =>
                      whitelistMember({loyaltyMemberId: member?.id, ruleId}),
                    ),
                  );
                } else {
                  await Promise.all(
                    Object.values(FraudRules).map((ruleId) =>
                      unwhitelistMember({loyaltyMemberId: member?.id, ruleId}),
                    ),
                  );
                }
              }}>
              SAVE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
      <Card className="mb-10" data-testid="loyalty-card-summary">
        <CardHeading title="Loyalty cards">
          {isSuccess && member?.cardNumber && (
            <DropdownMenu label="MANAGE CARD" variant="outline">
              <DropdownMenuItems width="match-button">
                <DropdownItem onSelect={() => setOpenUnlinkModal(true)}>Unlink card</DropdownItem>
                <DropdownItem onSelect={() => setOpenUnlinkHistoryModal(true)}>
                  Unlinked card history
                </DropdownItem>
                <DropdownItem
                  onSelect={() => setOpenManageCardGroupModal(true)}
                  disabled={!canAccessCardGroup}>
                  Manage card group
                </DropdownItem>
                <HasPermission accessWith={[loyaltyMemberRoles.update]}>
                  <DropdownItem onSelect={() => setExemptionConfirmationOpen(true)}>
                    {unwhiteListed ? 'Enable' : 'Disable'} fraud check exemption
                  </DropdownItem>
                </HasPermission>
              </DropdownMenuItems>
            </DropdownMenu>
          )}
        </CardHeading>
        <CardContent>
          {paginatedData?.length > 1 && (
            <Alert
              variant="warning"
              className="mb-5 cursor-pointer"
              feature="button"
              description="We found this user has more than one Mesra card under his/her IC number"
              onClick={() => setIsOpen(true)}
            />
          )}
          {isSuccess && memberData?.cardNumber ? (
            <div>
              <PointRuleField name="Card number">{maskMesra(memberData.cardNumber)}</PointRuleField>
              <PointRuleField name="Card type">
                {memberData.cardFormFactor === FormFactor.PHYSICAL ? 'Physical' : 'Virtual'}
              </PointRuleField>
              <PointRuleField name="Card group">{lookUpId[memberData.cardGroupId]}</PointRuleField>
              <HasPermission accessWith={[loyaltyMemberRoles.view]}>
                <PointRuleField name="Exclude from fraud checks">
                  {unwhiteListed ? 'Disabled' : 'Enabled'}
                </PointRuleField>
              </HasPermission>
            </div>
          ) : (
            <div className="text-center py-5 text-mediumgrey text-md">
              No mesra card linked yet
              <br />
              <Button
                variant="outline"
                onClick={() => setOpenLinkModal(true)}
                leftIcon={<PlusIcon />}
                className="mt-5">
                GET A CARD
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export type MultipleMemberModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  members?: Member[];
};

export const MultipleMemberModal: React.VFC<MultipleMemberModalProps> = ({
  isOpen,
  onDismiss,
  members,
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} aria-label="multiple-member">
      <ModalHeader>Multiple member summary</ModalHeader>
      <Table>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>No</Td>
            <Td>Name</Td>
            <Td>Card number</Td>
            <Td>Phone number</Td>
            <Td>Point balance</Td>
          </Tr>
        </DataTableRowGroup>
        {members?.length ? (
          <DataTableRowGroup>
            {members.map((member, index) => (
              <PerMemberLine member={member} index={index} key={member.id} />
            ))}
          </DataTableRowGroup>
        ) : (
          <DataTableCaption
            className="text-center py-12 text-mediumgrey text-md"
            data-testid="no-categories">
            <p>No records found</p>
            <p>Try again with a different information type</p>
          </DataTableCaption>
        )}
      </Table>
    </Modal>
  );
};

export type PerMemberLineProps = {
  member: Member;
  index: number;
};

export const PerMemberLine: React.VFC<PerMemberLineProps> = ({member, index}) => {
  const {data} = useGetCardBalanceByCardNumber(member.cardNumber);

  return (
    <Tr
      render={(props) => (
        <a {...props} href={`/loyalty/members/${member.id}`} data-testid="members-row" />
      )}>
      <Td>{index + 1}</Td>
      <Td>{member.name}</Td>
      <Td>{member.cardNumber && maskMesra(member.cardNumber)}</Td>
      <Td>{member.mobileNo}</Td>
      <Td>{data?.pointTotalBalance ?? '-'}</Td>
    </Tr>
  );
};
