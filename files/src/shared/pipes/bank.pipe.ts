import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';
import {BankInfos} from 'src/app/acquirers/shared/const-var';
import {IBankInfo} from 'src/app/api-switch.service';

@Pipe({
  name: 'bankName',
})
export class BankNamePipe implements PipeTransform {
  transform(value: string): string {
    const bank = _.find(BankInfos, (bi: IBankInfo) => bi.id === value);
    return bank ? bank.name : value;
  }
}
