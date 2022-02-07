import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.scss'],
})
export class CollapseComponent {
  @Input()
  title = '';

  @Input()
  active = false;

  @Input()
  small = false;

  expandMenuIcon(): string {
    return this.active ? 'assets/images/icons/minus.svg' : 'assets/images/icons/plus.svg';
  }

  toggle() {
    this.active = !this.active;
  }
}
