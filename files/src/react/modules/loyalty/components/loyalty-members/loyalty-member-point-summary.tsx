import * as React from 'react';
import {
  Card,
  CardHeading,
  CardContent,
  DropdownMenu,
  DropdownMenuItems,
  DropdownItem,
  FieldContainer,
  Fieldset,
  formatDate,
} from '@setel/portal-ui';
import {Member} from '../../loyalty-members.type';
import {useGetCardBalanceByCardNumber} from '../../loyalty.queries';
import {formatThousands} from 'src/shared/helpers/formatNumber';
import {LoyaltyMemberPointTransferModal} from './loyalty-member-point-transfer-modal';
import {LoyaltyMemberPointAdjustmentModal} from './loyalty-member-point-adjustment-modal';
import {
  useCanEditPointAdjustments,
  useCanEditPointTransfers,
} from '../../custom-hooks/use-check-permissions';
import {convertToDate} from 'src/shared/helpers/loyalty-format-date';

export type LoyaltyMemberPointSummaryProps = {
  member?: Member;
};

export const LoyaltyMemberPointSummary: React.VFC<LoyaltyMemberPointSummaryProps> = ({member}) => {
  const [openTransferModal, setOpenTransferModal] = React.useState<boolean>(false);
  const [openAdjustmentModal, setOpenAdjustmentModal] = React.useState<boolean>(false);
  const {data: pointExpiry, isSuccess} = useGetCardBalanceByCardNumber(member?.cardNumber);

  const canPerformTransfer = useCanEditPointTransfers();
  const canPerformAdjustments = useCanEditPointAdjustments();

  return (
    <>
      <LoyaltyMemberPointTransferModal
        isOpen={openTransferModal}
        onDismiss={() => setOpenTransferModal(false)}
        member={member}
      />
      <LoyaltyMemberPointAdjustmentModal
        isOpen={openAdjustmentModal}
        onDismiss={() => setOpenAdjustmentModal(false)}
        member={member}
      />
      <Card className="mb-10" data-testid="loyalty-point-summary">
        <CardHeading title="Points summary">
          {(canPerformAdjustments || canPerformTransfer) && (
            <DropdownMenu label="CREATE TRANSACTION" variant="outline">
              <DropdownMenuItems width="match-button">
                <DropdownItem
                  onSelect={() => setOpenTransferModal(true)}
                  disabled={!canPerformTransfer}>
                  Point transfer
                </DropdownItem>
                <DropdownItem
                  onSelect={() => setOpenAdjustmentModal(true)}
                  disabled={!canPerformAdjustments}>
                  Point adjustment
                </DropdownItem>
              </DropdownMenuItems>
            </DropdownMenu>
          )}
        </CardHeading>
        <CardContent>
          <Fieldset legend="GENERAL">
            <FieldContainer label="Point balance" layout="horizontal-responsive" labelAlign="start">
              <div className="text-sm pt-2.5">
                {pointExpiry?.pointTotalBalance ? `${pointExpiry.pointTotalBalance} pts` : '0 pts'}
              </div>
            </FieldContainer>
          </Fieldset>
          {isSuccess && pointExpiry?.pointsExpiryDates?.length > 0 && (
            <Fieldset legend="POINT EXPIRIES" borderTop>
              {pointExpiry?.pointsExpiryDates.map((val, index) => (
                <FieldContainer
                  label={formatDate(convertToDate(val.expiringPointsDate as unknown as string), {
                    format: 'LLLL yyyy',
                  })}
                  layout="horizontal-responsive"
                  labelAlign="start"
                  key={index}>
                  <div className="text-sm pt-2.5">{`${formatThousands(
                    val.expiringPointsAmount,
                  )} pts`}</div>
                </FieldContainer>
              ))}
            </Fieldset>
          )}
        </CardContent>
      </Card>
    </>
  );
};
