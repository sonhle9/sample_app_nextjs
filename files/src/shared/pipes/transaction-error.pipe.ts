import {Pipe, PipeTransform} from '@angular/core';
import {ITransaction} from '../interfaces/transaction.interface';

@Pipe({
  name: 'transactionError',
})
export class TransactionErrorPipe implements PipeTransform {
  transform(item: ITransaction): any {
    const error = this.formatErrorMessage(item.error);
    if (error.length !== 0) {
      return error.join(' - ');
    }

    const json = item.rawError;
    if (!json) {
      return '';
    }

    const rawError = this.tryParseJson(json);
    if (rawError && rawError.data) {
      return rawError.data[0] || '';
    }

    return this.formatErrorMessage(rawError).join(' - ') || json;
  }

  private tryParseJson(json: string) {
    try {
      const result = JSON.parse(json);
      if (typeof result !== 'string') {
        return result;
      }
      return this.tryParseJson(result);
    } catch (ex) {}
  }

  private formatErrorMessage(error): string[] {
    if (!error) {
      return [];
    }

    if (error.status) {
      return this.formatErrorMessage(error.status);
    }

    const keys = [
      ['code', 'description'],
      ['Code', 'Message'],
    ];

    for (const key of keys) {
      const values = this.existKeysAndGetValues(error, key);
      if (values.length === 0) {
        continue;
      }
      return values;
    }
    return [];
  }

  private existKeysAndGetValues<T extends unknown>(
    object: T,
    objectKeys: Array<keyof T>,
  ): string[] {
    const messages = [];
    for (const key of objectKeys) {
      const value = object[key];
      if (!value) {
        continue;
      }
      messages.push(value);
    }
    return messages;
  }
}
