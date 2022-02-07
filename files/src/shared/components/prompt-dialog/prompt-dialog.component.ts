import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss'],
})
export class PromptDialogComponent {
  text: string;
  trueBtnText: string;
  falseBtnText: string;
  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.text = data.text;
    this.trueBtnText = data.trueBtnText;
    this.falseBtnText = data.falseBtnText;
  }
}
