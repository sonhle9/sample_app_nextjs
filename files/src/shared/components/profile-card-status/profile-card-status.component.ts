import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-profile-card-status',
  templateUrl: './profile-card-status.component.html',
  styleUrls: ['./profile-card-status.component.scss'],
})
export class ProfileCardStatusComponent implements OnInit {
  @Input() status = '';

  constructor() {}

  ngOnInit() {}
}
