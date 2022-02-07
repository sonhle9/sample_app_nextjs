import {Component} from '@angular/core';
import {OutageChatSupport} from 'src/react/modules/outage/components/outage-chat-suppport';

@Component({
  selector: 'app-outage-chat-support',
  template: '<div [appReactComponent]="reactComponent" ></div>',
})
export class OutageChatSupportComponent {
  reactComponent = OutageChatSupport;
}
