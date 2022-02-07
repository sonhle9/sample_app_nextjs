import {Button, Modal} from '@setel/portal-ui';
import * as React from 'react';
import {ICircleMember} from 'src/shared/interfaces/circles.interface';

interface Props {
  showModal: boolean;
  member: ICircleMember;
  isLoading: boolean;
  onConfirmCallBack: (memberId: string) => void;
  onCloseCallBack: () => void;
}

export const SetelShareRemoveMemberModal: React.VFC<Props> = (props) => {
  return (
    <Modal
      data-testid="setelshare-remove-member-modal"
      size="small"
      showCloseBtn={false}
      header={`Are you sure you want to remove ${props.member?.fullName} as member`}
      isOpen={props.showModal}
      onDismiss={props.onCloseCallBack}>
      <Modal.Body>
        <p>Once remove, this action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer className="text-right">
        <Button
          className="mr-2"
          variant="outline"
          disabled={props.isLoading}
          onClick={props.onCloseCallBack}
          autoFocus>
          CANCEL
        </Button>
        <Button
          variant="error"
          isLoading={props.isLoading}
          onClick={() => props.onConfirmCallBack(props.member?.id)}>
          REMOVE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
