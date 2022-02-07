import {Component} from '@angular/core';

@Component({
  selector: 'app-filter-container',
  template: '<div class="filter-container"><ng-content></ng-content></div>',
  styles: [
    `
      .filter-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-top: 8px;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class FilterContainerComponent {}
