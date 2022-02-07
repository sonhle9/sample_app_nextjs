import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, zip} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {ApiCardService} from 'src/app/api-cards.service';
import {environment} from '../../../../environments/environment';
import * as _ from 'lodash';
import {AllowedFuelProductss} from '../../shared/enums';
import {CarddetailsModalComponent} from '../card-details-modal/card-details-modal.component';
import {ICardRole} from 'src/shared/interfaces/card.interface';

@Component({
  moduleId: module.id,
  selector: 'app-card-details',
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss'],
})
export class CardDetailsComponent implements OnDestroy, OnInit {
  constructor(
    route: ActivatedRoute,
    private apiCardService: ApiCardService,
    private dialog: MatDialog,
  ) {
    zip(route.params, route.queryParams)
      .pipe(takeUntil(this.allSub))
      .subscribe(([param, query]) => {
        this.cardId = param.id;
        this.targetService = query['target-service'];
        this.initCard(param.id);
      });
  }
  readonly webDashboardUrl = environment.webDashboardUrl;
  cardId: string;
  card: any;
  title: string;
  targetService: string;
  allowedFuelProducts: any;
  countCheckFuel = 0;
  timeline: any;
  details: any;
  resourceName: string;
  message: string;
  messageType: string;
  roles: ICardRole;
  allSub: Subject<any> = new Subject<any>();
  vehicle: any = {
    vehicleReg: 'WUV138',
    vehicleDetails: 'Mitsubihi Canter (Silver) ',
    lastestMileage: '100,00km',
    dateCreated: '12 Oct 2019, 11:00 AM',
  };

  ngOnInit() {
    this.initCard(this.cardId);
    this.roles = this.apiCardService.getCardRolePermissions();
  }

  initCard(id: string) {
    this.apiCardService
      .readCard(id)
      .pipe(takeUntil(this.allSub))
      .subscribe((res) => {
        this.card = res;
        this.title =
          res.type === 'fleet'
            ? this.fnChangeShowName(res.subtype) + ' - ' + res.cardNumber
            : '' + `${res.cardNumber.substring(0, 6)}********${res.cardNumber.substring(13, 17)}`;

        this.timeline = this.card.timeline ? this.card.timeline : [];
        this.allowedFuelProducts = AllowedFuelProductss.map((item) => {
          if (this.card.limitation.allowedFuelProducts.includes(item.value)) {
            this.countCheckFuel++;
            return {
              ...item,
              checked: true,
            };
          } else {
            return {
              ...item,
              checked: false,
            };
          }
        });
      });
  }

  fnChangeShowName = (str: string) => {
    return _.isString(str)
      ? (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).split('_').join(' ')
      : str;
  };

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  gotoCarddetailsDB() {
    window.open(
      `${this.webDashboardUrl}/merchants/${this.card.merchantId}/card-issuing/cards/${this.card.id}`,
    );
  }

  openModal() {
    const dialogRef = this.dialog.open(CarddetailsModalComponent, {
      data: this.card,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      if (res.isSuccess) {
        this.messageType = 'success';
        this.message = `${this.resourceName} was updated successfully`;
        this.initCard(this.cardId);
      } else {
        this.messageType = 'error';
        this.message = res.data;
      }
    });
  }
}
