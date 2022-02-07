import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-json-edit-modal',
  templateUrl: './json-edit-modal.component.html',
  styleUrls: ['./json-edit-modal.style.scss'],
})
export class JsonEditModalComponent implements OnInit {
  validJson = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<JsonEditModalComponent>,
  ) {}

  get json() {
    return JSON.stringify(this.data, null, 2);
  }

  set json(val) {
    try {
      this.data = JSON.parse(val);
      this.validJson = true;
    } catch (ex) {
      this.validJson = false;
    }
  }

  ngOnInit() {}

  onUpdate() {
    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
