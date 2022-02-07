import {Card, Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {ICircle, ICircleMember} from '../../../../../shared/interfaces/circles.interface';
import {SetelShareMemberTable} from '../../components/setelshare-member-table';
import {isActiveMember} from '../../setelshare.helper';

interface Props {
  circleDetails: ICircle | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const SetelShareDetailsMembers: React.VFC<Props> = (props) => {
  const [currentMembers, setCurrentMembers] = React.useState<ICircleMember[]>([]);
  const [formerMembers, setFormerMembers] = React.useState<ICircleMember[]>([]);

  React.useEffect(() => {
    if (props.circleDetails?.members?.length) {
      const members = props.circleDetails.members;
      setCurrentMembers(members.filter((member) => isActiveMember(member.memberStatus)));
      setFormerMembers(members.filter((member) => !isActiveMember(member.memberStatus)));
    }
  }, [props.circleDetails]);

  return (
    <Card data-testid="setelshare-details-members">
      <Card.Heading title="Members" />
      <Tabs>
        <Tabs.TabList>
          <Tabs.Tab label="Current" />
          <Tabs.Tab label="Former" />
        </Tabs.TabList>

        <Tabs.Panels>
          <Tabs.Panel>
            <SetelShareMemberTable
              circle={props.circleDetails}
              members={currentMembers}
              isLoading={props.isLoading}
              isError={props.isError}
            />
          </Tabs.Panel>
          <Tabs.Panel>
            <SetelShareMemberTable
              members={formerMembers}
              isLoading={props.isLoading}
              isError={props.isError}
              isFormer
            />
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </Card>
  );
};
