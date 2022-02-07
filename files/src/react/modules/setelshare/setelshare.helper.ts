import {CircleMemberStatus} from 'src/shared/enums/circle.enum';
import {ICircleMember} from 'src/shared/interfaces/circles.interface';

export function isActiveMember(memberStatus: CircleMemberStatus): boolean {
  return ![
    CircleMemberStatus.REMOVED,
    CircleMemberStatus.REJECTED,
    CircleMemberStatus.LEFT,
    CircleMemberStatus.CANCELLED,
  ].includes(memberStatus);
}

export function getMemberLeaveDateByStatus(member: ICircleMember): string {
  switch (member.memberStatus) {
    case CircleMemberStatus.REMOVED:
    case CircleMemberStatus.LEFT:
      return member.leaveDatetime;
    case CircleMemberStatus.REJECTED:
    case CircleMemberStatus.CANCELLED:
      return member.cancelDatetime;
    default:
      return '';
  }
}

export const capitalizeFirstLetter = (value?: string) => {
  if (value) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  return '';
};
