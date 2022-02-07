import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-fuel-recovery-view',
  templateUrl: './fuel-recovery-view.component.html',
  styleUrls: ['./fuel-recovery-view.component.scss'],
})
export class FuelRecoveryViewComponent implements OnInit {
  selectedVal: string;
  constructor() {}

  ngOnInit() {
    this.selectedVal = window.location.pathname.includes('lost') ? 'lost' : 'pending';
  }
}
