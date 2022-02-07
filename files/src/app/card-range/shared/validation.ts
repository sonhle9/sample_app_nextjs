import * as _ from 'lodash';

export class MessageBag {
  constructor(public messages: {[key: string]: any} = {}) {}

  has(key: string) {
    return _.has(this.messages, key);
  }

  getOne(key: string): string | undefined {
    const message = _.get(this.messages, key);
    if (_.isString(message)) {
      return message;
    }
    if (_.isArray(message) && !_.isEmpty(message)) {
      return message[0];
    }
    return undefined;
  }

  get(key: string): string[] {
    const message = _.get(this.messages, key);
    if (_.isString(message)) {
      return [message];
    }
    if (_.isArray(message)) {
      return message;
    }
    return [];
  }

  all(): string[] {
    return this.extractMessages(this.messages);
  }

  private extractMessages(messages: any): string[] {
    const messageList = [];
    _.forOwn(messages, (value) => {
      if (!value) {
        return;
      }

      if (_.isPlainObject(value)) {
        messageList.push(this.extractMessages(value));
      } else if (_.isArray(value)) {
        messageList.push(_.map(value, _.toString));
      } else {
        messageList.push(_.toString(value));
      }
    });
    return messageList;
  }
}
