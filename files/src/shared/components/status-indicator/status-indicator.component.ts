import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-status-indicator',
  template: '<div class="status-indicator" [ngClass]="color"></div>',
  styleUrls: ['./status-indicator.component.scss'],
})
export class StatusIndicatorComponent {
  @Input()
  color: 'success' | 'error' | 'danger' | 'inactive' | 'pending';
}
