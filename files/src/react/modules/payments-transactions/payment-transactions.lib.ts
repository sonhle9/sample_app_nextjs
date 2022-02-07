import {TRANSACTION_MIX_PAYMENT_METHODS} from 'src/app/transactions/shared/const-var';
import {PaymentTransaction} from 'src/react/services/api-payments.service';
import {IError, ITransaction} from 'src/shared/interfaces/transaction.interface';

export const readErrorMessage = (transaction: Pick<ITransaction, 'error' | 'rawError'>): string => {
  if (transaction.error) {
    const errors = formatErrorMessage(transaction.error);

    if (errors.length > 0) {
      return errors.join(' - ');
    }
  }

  const rawError = transaction.rawError;

  if (!rawError) {
    return '';
  }

  const parsedError = parseJson(rawError);

  if (parsedError && parsedError.data) {
    return parsedError.data[0] || '';
  }

  return formatErrorMessage(parsedError).join(' - ') || rawError;
};

function parseJson(json: string) {
  try {
    const result = JSON.parse(json);
    if (typeof result !== 'string') {
      return result;
    }
    if (result) {
      return parseJson(result);
    }
  } catch (err) {}
}

function formatErrorMessage(error: IError & {message?: string; Code?: string}): Array<string> {
  if (!error) {
    return [];
  }

  if (error.code || error.description) {
    return [error.code, error.description].filter(Boolean);
  }

  if (error.message || error.Code) {
    return [error.Code, error.message].filter(Boolean);
  }

  return [];
}

const mapping = Object.values(TRANSACTION_MIX_PAYMENT_METHODS);

export const getPaymentMethod = (trx: PaymentTransaction) => {
  const matchedMapping = mapping.find(
    (mx) => mx.paymentMethod === trx.paymentMethod && mx.paymentSubmethod === trx.paymentSubmethod,
  );

  return matchedMapping ? matchedMapping.text : '';
};
