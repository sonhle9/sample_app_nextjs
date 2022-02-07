import {Badge, BareButton, DataTable as Table, formatDate} from '@setel/portal-ui';
import * as React from 'react';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {ICircle, ICircleMember} from 'src/shared/interfaces/circles.interface';
import {circleMemberStatusColorMap} from '../setelshare.const';
import {getMemberLeaveDateByStatus} from '../setelshare.helper';
import {useRemoveSetelShareMember} from '../setelshare.queries';
import {SetelShareRemoveMemberModal} from './setelshare-remove-member-modal';
import {SetelShareUserExternalIcon} from './setelshare-user-external-icon';

const defaultModalData = {
  show: false,
  memberData: {} as ICircleMember,
};

interface Props {
  circle?: ICircle;
  members: ICircleMember[];
  isLoading: boolean;
  isError: boolean;
  isFormer?: boolean;
}

export const SetelShareMemberTable: React.VFC<Props> = (props) => {
  const {mutate: onRemoveMember, isLoading: isRemovingMember} = useRemoveSetelShareMember(
    props.circle?.id,
  );

  const [modalData, setModalData] = React.useState({...defaultModalData});

  React.useEffect(() => {
    if (!isRemovingMember) {
      setModalData({...defaultModalData});
    }
  }, [isRemovingMember]);

  return (
    <Table data-testid="setelshare-member-listing" isLoading={props.isLoading}>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>MEMBERS</Table.Td>
          <Table.Td>STATUS</Table.Td>
          <Table.Td>JOINED DATE</Table.Td>
          <Table.Td className="text-right">{props.isFormer && 'LEAVE DATE'}</Table.Td>
        </Table.Tr>
      </Table.Thead>

      {!props.isLoading && (!props.members?.length || props.isError) ? (
        <EmptyDataTableCaption />
      ) : (
        <Table.Tbody>
          {!props.isLoading &&
            props.members?.map((member) => (
              <Table.Tr key={member.id}>
                <Table.Td>
                  {member.fullName && (
                    <div className="flex text-black">
                      {member.fullName}
                      <SetelShareUserExternalIcon userId={member.userId} />
                    </div>
                  )}
                </Table.Td>
                <Table.Td>
                  {member.memberStatus && (
                    <Badge
                      color={circleMemberStatusColorMap[member.memberStatus] || 'grey'}
                      className="uppercase">
                      {member.memberStatus}
                    </Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  {member.joinedDatetime ? formatDate(member.joinedDatetime) : '-'}
                </Table.Td>
                <Table.Td className="text-right">
                  {props.isFormer ? (
                    member.leaveDatetime || member.cancelDatetime ? (
                      formatDate(getMemberLeaveDateByStatus(member))
                    ) : (
                      '-'
                    )
                  ) : (
                    <BareButton
                      className="text-error-500"
                      onClick={() => setModalData({show: true, memberData: member})}
                      disabled={props.circle?.isDeleted}>
                      REMOVE
                    </BareButton>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      )}

      <SetelShareRemoveMemberModal
        showModal={modalData.show}
        member={modalData.memberData}
        isLoading={isRemovingMember}
        onConfirmCallBack={onRemoveMember}
        onCloseCallBack={() => setModalData({...defaultModalData})}
      />
    </Table>
  );
};
