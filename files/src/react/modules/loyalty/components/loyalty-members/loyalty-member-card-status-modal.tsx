import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FieldContainer,
  TextField,
  DropdownSelect,
  Textarea,
  Button,
  formatDate,
  Notification,
  useTransientState,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {
  Member,
  MemberStatus,
  MemberStatusName,
  MemberType,
  IdType,
  IdTypeName,
} from '../../loyalty-members.type';
import {useUpdateLoyaltyMember, useActivateCard} from '../../loyalty.queries';
import {maskMesra} from 'src/shared/helpers/mask-helpers';
import {isValidICNumber, isValidPassportNumber} from 'src/shared/helpers/check-valid-id';

type LoyaltyMemberChangeCardStatusModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  member?: Member;
};

export const LoyaltyMemberChangeCardStatusModal: React.VFC<LoyaltyMemberChangeCardStatusModalProps> =
  ({isOpen, onDismiss, member}) => {
    const [status, setStatus] = React.useState('');
    const [memberStatusRemarks, setRemarks] = React.useState('');
    const [idtype, setIdtype] = React.useState('');
    const [idRef, setIdnumber] = React.useState('');
    const {
      mutateAsync: mutateActivateCard,
      isError: activateIsError,
      error: activateError,
    } = useActivateCard();
    const {
      mutateAsync: mutateUpdateCardStatus,
      isError: updateIsError,
      error: updateError,
    } = useUpdateLoyaltyMember();
    const [showNotification, setShowNotification] = useTransientState(false);
    const canActivate = Boolean(
      member?.firstActivatedOn || member?.memberType === MemberType.NON_SETEL,
    );

    React.useEffect(() => {
      setIdtype(member?.idType || '');
      setIdnumber(member?.idRef || '');
    }, [member, isOpen]);

    const statuses = [
      {
        label: 'Activate or Issued',
        value: MemberStatus.ACTIVE,
        disabled:
          member?.memberStatus === MemberStatus.ACTIVE ||
          (member?.memberStatus === MemberStatus.ISSUED &&
            member?.memberType !== MemberType.NON_SETEL),
      },
      {
        label: MemberStatusName.get(MemberStatus.FROZEN),
        value: MemberStatus.FROZEN,
        disabled: member?.memberStatus === MemberStatus.FROZEN,
      },
      {
        label: MemberStatusName.get(MemberStatus.FROZEN_TEMP),
        value: MemberStatus.FROZEN_TEMP,
        disabled: member?.memberStatus === MemberStatus.FROZEN_TEMP,
      },
    ];

    const idOptions = [
      {
        label: IdTypeName.get(IdType.NEW_IC),
        value: IdType.NEW_IC,
      },
      {
        label: IdTypeName.get(IdType.PASSPORT),
        value: IdType.PASSPORT,
      },
    ];

    const handleReset = () => {
      setStatus('');
      setRemarks('');
      setIdtype('');
      setIdnumber('');
    };

    const handleDismiss = () => {
      handleReset();
      onDismiss();
    };

    const handleSubmit = async () => {
      if (status === MemberStatus.ACTIVE) {
        canActivate
          ? await mutateActivateCard(
              {
                cardNumber: member?.cardNumber,
                userId: member?.userId,
                idRef,
                idType: idtype as IdType,
              },
              {
                onSuccess: () => {
                  setShowNotification(true);
                  handleDismiss();
                },
              },
            )
          : await mutateUpdateCardStatus(
              {
                ...member,
                memberStatus: MemberStatus.ISSUED,
                memberStatusRemarks: `[${formatDate(new Date())}] - ${memberStatusRemarks}`,
              },
              {
                onSuccess: () => {
                  setShowNotification(true);
                  handleDismiss();
                },
              },
            );
      } else {
        await mutateUpdateCardStatus(
          {
            ...member,
            memberStatus: status as MemberStatus,
            memberStatusRemarks: `[${formatDate(new Date())}] - ${memberStatusRemarks}`,
          },
          {
            onSuccess: () => {
              setShowNotification(true);
              handleDismiss();
            },
          },
        );
      }
    };

    const isValid = React.useMemo(() => {
      if (status === MemberStatus.ACTIVE && canActivate) {
        if (idtype === IdType.NEW_IC && isValidICNumber(idRef)) {
          return true;
        }
        if (idtype === IdType.PASSPORT && isValidPassportNumber(idRef)) {
          return true;
        }
        return false;
      }

      return true;
    }, [status, idtype, idRef]);

    return (
      <>
        <Notification
          isShow={showNotification}
          variant="success"
          title="Successfully updated member status"
        />
        <Modal
          isOpen={isOpen}
          onDismiss={handleDismiss}
          data-testid="card-status-modal"
          aria-label="change-card-status">
          <ModalHeader>Change loyalty status</ModalHeader>
          <ModalBody>
            {(activateIsError || updateIsError) && (
              <div className="pb-4">
                <QueryErrorAlert
                  error={(activateError as any) || (updateError as any) || null}
                  description="Error while updating card status"
                />
              </div>
            )}

            <FieldContainer
              label="Card number"
              layout="horizontal-responsive"
              className="mb-0"
              labelAlign="start">
              <TextField
                value={maskMesra(member?.cardNumber) || ''}
                className="w-72 text-gray-500"
                disabled
              />
            </FieldContainer>
            <FieldContainer label="Status" layout="horizontal-responsive" labelAlign="start">
              <DropdownSelect<string>
                value={status}
                onChangeValue={setStatus}
                placeholder="Select any status"
                options={statuses}
                className="w-72"
              />
            </FieldContainer>
            {status &&
              (status === MemberStatus.ACTIVE && canActivate ? (
                <>
                  <FieldContainer label="ID type" layout="horizontal-responsive" labelAlign="start">
                    <DropdownSelect<string>
                      value={idtype}
                      onChangeValue={setIdtype}
                      placeholder="Select any ID type"
                      options={idOptions}
                      className="w-72"
                    />
                  </FieldContainer>
                  <FieldContainer
                    label="ID number"
                    layout="horizontal-responsive"
                    className="mb-0"
                    labelAlign="start">
                    <TextField
                      value={idRef}
                      onChangeValue={setIdnumber}
                      placeholder="Insert ID number"
                      className="w-72"
                      status={idRef && !isValid ? 'error' : null}
                      helpText={idRef && !isValid ? 'Input a valid ID number' : null}
                    />
                  </FieldContainer>
                </>
              ) : (
                <FieldContainer label="Remarks" layout="horizontal-responsive" labelAlign="start">
                  <Textarea value={memberStatusRemarks} onChangeValue={setRemarks} />
                </FieldContainer>
              ))}
          </ModalBody>
          <ModalFooter className="text-right">
            <Button variant="outline" className="mr-5" onClick={handleDismiss}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
              SAVE
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  };
