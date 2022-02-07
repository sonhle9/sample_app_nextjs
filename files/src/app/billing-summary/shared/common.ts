import {formatDate, formatMoney} from '@setel/portal-ui';

export const showAmountStatement = (amount: number | undefined) => {
  return amount > 0 ? `-${formatMoney(Math.abs(amount))}` : `${formatMoney(Math.abs(amount || 0))}`;
};

export const showAmountStatementWithRM = (amount: number | undefined) => {
  return amount > 0
    ? `-RM${formatMoney(Math.abs(amount))}`
    : `RM${formatMoney(Math.abs(amount || 0))}`;
};

export const formatStatementTransactionDate = (dateTime: string | undefined) => {
  return (
    formatDate(
      new Date(dateTime).toLocaleString('en-US', {
        timeZone: 'Asia/Kuala_Lumpur',
      }),
      {formatType: 'dateOnly'},
    ) +
    ', ' +
    formatDate(
      new Date(dateTime).toLocaleString('en-US', {
        timeZone: 'Asia/Kuala_Lumpur',
      }),
      {format: 'h:mm:ss a'},
    )
  );
};
