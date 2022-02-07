import {EventEmitter} from '@angular/core';

export class AppEmitter {
  static SessionExpired = 'SessionExpired';
  static PermissionDenied = 'PermissionDenied';
  static AddedStation = 'AddedStation';
  static UpdatedStation = 'UpdatedStation';

  private static emitters: {
    [nomeEvento: string]: EventEmitter<any>;
  } = {};

  static get(nomeEvento: string): EventEmitter<any> {
    if (!this.emitters[nomeEvento]) {
      this.emitters[nomeEvento] = new EventEmitter<any>();
    }
    return this.emitters[nomeEvento];
  }
}
