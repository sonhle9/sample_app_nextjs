import {Pipe, PipeTransform} from '@angular/core';
import {AcquirersSecurityProtocol} from 'src/app/api-switch.service';

@Pipe({
  name: 'securityProtocol',
})
export class SecurityProtocolPipe implements PipeTransform {
  transform(param: AcquirersSecurityProtocol): string {
    switch (param) {
      case AcquirersSecurityProtocol.TWO_D:
        return '2D';
      case AcquirersSecurityProtocol.THREE_D:
        return '3D Secure';
      default:
        return param;
    }
  }
}
