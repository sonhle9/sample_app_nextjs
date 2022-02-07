import * as React from 'react';
import {
  TextEllipsis,
  Card,
  CardHeading,
  CardContent,
  formatDate,
  DropdownMenu,
  DropdownMenuItems,
  DropdownItem,
  DescList,
  Badge,
} from '@setel/portal-ui';
// import {PointRuleField} from '../point-rule-field';
import {useGetLoyaltyMemberById, useGetLoyaltyMembersByCardNumber} from '../../loyalty.queries';
import {
  translateIdType,
  MemberStatus,
  translateMemberStatus,
  MemberType,
} from '../../loyalty-members.type';
import {MemberEditModal} from './loyalty-member-edit-modal';
import {LoyaltyMemberPointDetails} from './loyalty-member-point-details';
import {LoyaltyCardSummary} from './loyalty-card-summary';
import {LoyaltyMemberPointSummary} from './loyalty-member-point-summary';
import {maskIDNumber} from 'src/shared/helpers/mask-helpers';
import {LoyaltyMemberChangeCardStatusModal} from './loyalty-member-card-status-modal';
import {LoyaltyProgrammeModal} from './loyalty-programme-modal';
import {useCanEditMembers} from '../../custom-hooks/use-check-permissions';

export type LoyaltyMemberDetailsProps = {
  id: string;
  isCard?: boolean;
};

export const LoyaltyMemberDetails: React.VFC<LoyaltyMemberDetailsProps> = ({id, isCard}) => {
  const {
    data: memberIdData,
    isSuccess: memberIdSuccess,
    isLoading: memberIdLoading,
  } = useGetLoyaltyMemberById(id, {
    enabled: !isCard,
  });
  const {
    data: memberCardData,
    isSuccess: memberCardSuccess,
    isLoading: memberCardLoading,
  } = useGetLoyaltyMembersByCardNumber(id, {enabled: !!isCard});
  const [editMemberIsOpen, setEditMemberIsOpen] = React.useState<boolean>(false);
  const [editStatusIsOpen, setEditStatusIsOpen] = React.useState<boolean>(false);
  const [editProgrammeIsOpen, setEditProgrammeIsOpen] = React.useState<boolean>(false);
  const canEditMembers = useCanEditMembers();

  const memberData = isCard ? memberCardData?.data?.[0] : memberIdData;
  const memberSuccess = (isCard ? memberCardSuccess : memberIdSuccess) && memberData;
  const memberLoading = isCard ? memberCardLoading : memberIdLoading;

  return (
    <>
      <MemberEditModal
        isOpen={editMemberIsOpen}
        onDismiss={() => setEditMemberIsOpen(false)}
        member={memberData}
      />
      <LoyaltyMemberChangeCardStatusModal
        isOpen={editStatusIsOpen}
        onDismiss={() => setEditStatusIsOpen(false)}
        member={memberData}
      />
      <LoyaltyProgrammeModal
        isOpen={editProgrammeIsOpen}
        onDismiss={() => setEditProgrammeIsOpen(false)}
        memberId={memberData?.id}
      />
      <div className="mx-auto px-16">
        <div className="mb-10 pt-8">
          <TextEllipsis
            className="flex-grow text-2xl pb-4"
            text="Member details"
            widthClass="w-full"
          />
          <Card>
            <CardHeading title="Member information">
              {memberSuccess && (
                <DropdownMenu label="MANAGE MEMBER" variant="outline">
                  <DropdownMenuItems>
                    <DropdownItem
                      onSelect={() => setEditMemberIsOpen(true)}
                      disabled={!canEditMembers}>
                      Update member information
                    </DropdownItem>
                    <DropdownItem onSelect={() => setEditStatusIsOpen(true)}>
                      Change loyalty status
                    </DropdownItem>
                    <DropdownItem onSelect={() => setEditProgrammeIsOpen(true)}>
                      Programme
                    </DropdownItem>
                  </DropdownMenuItems>
                </DropdownMenu>
              )}
            </CardHeading>
            <CardContent>
              {memberSuccess || memberLoading ? (
                <>
                  <DescList isLoading={memberLoading}>
                    <DescList.Item label="Name" value={memberData?.name || '-'} />
                    <DescList.Item label="Phone number" value={memberData?.mobileNo || '-'} />
                    <DescList.Item label="Email" value={memberData?.email || '-'} />
                    <DescList.Item label="Address" value={memberData?.address?.street || '-'} />
                    <DescList.Item label="City" value={memberData?.address?.city || '-'} />
                    <DescList.Item label="State" value={memberData?.address?.state || '-'} />
                    <DescList.Item label="Zip code" value={memberData?.address?.zipcode || '-'} />
                    <DescList.Item
                      label="Date of birth"
                      value={
                        memberData?.dateOfBirth
                          ? formatDate(new Date(memberData.dateOfBirth), {
                              formatType: 'dateOnly',
                            })
                          : '-'
                      }
                    />
                    <DescList.Item
                      label="ID type"
                      value={memberData?.idType ? translateIdType(memberData.idType) : '-'}
                    />
                    <DescList.Item
                      label="ID number"
                      value={memberData?.idRef ? maskIDNumber(memberData.idRef) : '-'}
                    />
                    <DescList.Item
                      label="Setel member"
                      value={
                        <Badge
                          color={memberData?.memberType === MemberType.SETEL ? 'success' : 'grey'}>
                          {memberData?.memberType === MemberType.SETEL ? 'YES' : 'NO'}
                        </Badge>
                      }
                    />
                    <DescList.Item
                      label="Status"
                      value={
                        <Badge
                          color={
                            memberData?.memberStatus === MemberStatus.ACTIVE
                              ? 'success'
                              : memberData?.memberStatus === MemberStatus.ISSUED ||
                                memberData?.memberStatus === MemberStatus.FROZEN_TEMP
                              ? 'warning'
                              : 'grey'
                          }
                          rounded="rounded"
                          className="uppercase">
                          {translateMemberStatus(memberData?.memberStatus)}
                        </Badge>
                      }
                    />
                    {(memberData?.memberStatus === MemberStatus.FROZEN_TEMP ||
                      memberData?.memberStatus === MemberStatus.FROZEN) && (
                      <DescList.Item label="Remarks" value={memberData?.memberStatusRemarks} />
                    )}
                    <DescList.Item
                      label="Activated on"
                      value={
                        memberData?.lastActivatedOn
                          ? formatDate(memberData.lastActivatedOn)
                          : memberData?.firstActivatedOn
                          ? formatDate(memberData.firstActivatedOn)
                          : '-'
                      }
                    />
                  </DescList>
                </>
              ) : (
                <>
                  <div className="text-center py-5">No member associated to the card</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <LoyaltyCardSummary member={memberData} />
        <LoyaltyMemberPointSummary member={memberData} />
        <LoyaltyMemberPointDetails member={memberData} />
      </div>
    </>
  );
};
