import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-card-details-vehicle',
  templateUrl: './card-details-vehicle.html',
  styleUrls: ['./card-details-vehicle.scss'],
})
export class CarddetailsVehicleComponent implements OnInit, OnDestroy {
  @Input()
  card;

  allSub: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }
}
