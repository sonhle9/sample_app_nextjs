import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-json-popup',
  templateUrl: './json-popup.component.html',
  styleUrls: ['./json-popup.component.scss'],
})
export class JsonPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
