import * as React from 'react';
import {
  Text,
  DescList,
  DescItem,
  formatDate,
  Button,
  Modal,
  PlusIcon,
  formatMoney,
} from '@setel/portal-ui';
import {ICardRestriction} from '../card.type';
import {TabMode} from '../card.type';
import CardRestrictionEdit from './card-restriction-edit-modal';
import {HasPermission} from '../../auth/HasPermission';
import {cardRole} from 'src/shared/helpers/roles.type';
interface CardRestriction {
  mode: string;
  cardRestriction: ICardRestriction;
  className: String;
  cardID: string;
  card: any;
}
export const CardRestrictionDetails = (props: CardRestriction) => {
  const [showEditRestrictionForm, setShowEditRestrictionForm] = React.useState(false);
  const dailyLimitAmount = props?.cardRestriction?.velocity?.dailyLimit?.amount || 0;
  const monthlyLimitAmount = props?.cardRestriction?.velocity?.monthlyLimit?.amount || 0;
  const accumulateDailyAmount = props?.card?.accumulate?.dailyAmount || 0;
  const accumulateMonthlyAmount = props?.card?.accumulate?.monthlyAmount || 0;
  const dailyLimitCreatedOn = props?.cardRestriction?.velocity?.dailyLimit?.createdAt;
  const monthlyLimitCreatedOn = props?.cardRestriction?.velocity?.monthlyLimit?.createdAt;
  const dailyLimitUpdatedOn = props?.cardRestriction?.velocity?.dailyLimit?.updatedAt;
  const monthlyLimitUpdatedOn = props?.cardRestriction?.velocity?.monthlyLimit?.updatedAt;
  const singleTransactionLimit = props?.cardRestriction?.singleTransactionLimit?.amountTransaction;
  const singleTransactionLimitCreatedOn = props?.cardRestriction?.singleTransactionLimit?.createdAt;
  const singleTransactionLimitUpdateOn = props?.cardRestriction?.singleTransactionLimit?.updatedAt;

  return (
    <>
      {(props?.mode === TabMode.DAILY_LIMIT &&
        props?.cardRestriction?.velocity?.dailyLimit?.amount) ||
      (props?.mode === TabMode.MONTHLY_LIMIT &&
        props?.cardRestriction?.velocity?.monthlyLimit?.amount) ? (
        <div className="grid grid-cols-7">
          <DescList className="col-span-5">
            <DescItem
              label="Max. transaction amount"
              labelClassName="text-sm w-36"
              value={
                <div>
                  <div className="font-normal text-sm capitalize">
                    RM
                    {formatMoney(
                      Number(
                        props.mode === TabMode.DAILY_LIMIT ? dailyLimitAmount : monthlyLimitAmount,
                      ),
                    )}
                  </div>
                  <div className="font-light text-lightgrey text-xs capitalize">
                    Balance:{' '}
                    <span className="text-lightgrey">
                      RM
                      {props?.mode === TabMode.DAILY_LIMIT &&
                        formatMoney(
                          Number(
                            accumulateDailyAmount > dailyLimitAmount
                              ? 0
                              : dailyLimitAmount - accumulateDailyAmount,
                          ),
                        )}
                      {props?.mode === TabMode.MONTHLY_LIMIT &&
                        formatMoney(
                          Number(
                            accumulateMonthlyAmount > monthlyLimitAmount
                              ? 0
                              : monthlyLimitAmount - accumulateMonthlyAmount,
                          ),
                        )}
                    </span>
                  </div>
                </div>
              }
            />
            <DescItem
              label="Created on"
              labelClassName="text-sm w-36"
              value={
                <div>
                  <div className="font-normal text-sm capitalize">
                    {props?.mode === TabMode.DAILY_LIMIT
                      ? dailyLimitCreatedOn
                        ? formatDate(new Date(dailyLimitCreatedOn))
                        : '-'
                      : monthlyLimitCreatedOn
                      ? formatDate(new Date(monthlyLimitCreatedOn))
                      : '-'}
                  </div>
                </div>
              }
            />
            <DescItem
              label="Updated on"
              labelClassName="text-sm w-36"
              value={
                <div>
                  <div className="font-normal text-sm capitalize">
                    {props?.mode === TabMode.DAILY_LIMIT
                      ? dailyLimitUpdatedOn
                        ? formatDate(new Date(dailyLimitUpdatedOn))
                        : '-'
                      : monthlyLimitUpdatedOn
                      ? formatDate(new Date(monthlyLimitUpdatedOn))
                      : '-'}
                  </div>
                </div>
              }
            />
          </DescList>
        </div>
      ) : props?.mode === TabMode.OTHERS && singleTransactionLimit ? (
        <div>
          <DescList>
            <DescItem
              label="Max. amount allowed per trans."
              labelClassName="text-sm w-32"
              value={
                <div>
                  <div className="font-normal text-sm capitalize pt-2">
                    RM
                    {formatMoney(Number(singleTransactionLimit ? singleTransactionLimit : ''))}
                  </div>
                </div>
              }
            />
            <DescItem
              label="Created on"
              labelClassName="text-sm w-36"
              value={
                <div>
                  <div className="font-normal text-sm capitalize">
                    {' '}
                    {props?.mode === TabMode.OTHERS
                      ? singleTransactionLimitCreatedOn
                        ? formatDate(new Date(singleTransactionLimitCreatedOn))
                        : '-'
                      : '-'}
                  </div>
                </div>
              }
            />
            <DescItem
              label="Updated on"
              labelClassName="text-sm w-36"
              value={
                <div>
                  <div className="font-normal text-sm capitalize">
                    {' '}
                    {props?.mode === TabMode.OTHERS
                      ? singleTransactionLimitUpdateOn
                        ? formatDate(new Date(singleTransactionLimitUpdateOn))
                        : '-'
                      : '-'}
                  </div>
                </div>
              }
            />
          </DescList>
        </div>
      ) : (
        <div>
          <HasPermission accessWith={[cardRole.restriction_update]}>
            <Text className="px-8 pb-4 pt-4 text-center text-sm" color="black">
              You have not added any {props?.mode} restrictions yet.
            </Text>
            <div className="text-center pb-8">
              <Button
                variant="outline"
                leftIcon={<PlusIcon />}
                className="uppercase"
                onClick={() => {
                  setShowEditRestrictionForm(true);
                }}
                data-testid="open-modal-velocity">
                Add restrictions
              </Button>
            </div>
          </HasPermission>
        </div>
      )}
      {showEditRestrictionForm && (
        <Modal
          isOpen={showEditRestrictionForm}
          onDismiss={() => setShowEditRestrictionForm(false)}
          aria-label="Create/edit velocity check restrictions">
          <CardRestrictionEdit
            cardRestriction={props.cardRestriction}
            belongTo={props.cardID}
            onClose={() => {
              setShowEditRestrictionForm(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default CardRestrictionDetails;
