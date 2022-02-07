import {Component} from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <div class="container">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px 5%;
      }
    `,
  ],
})
export class ContentComponent {}
