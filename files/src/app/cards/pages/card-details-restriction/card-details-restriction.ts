import {Component, OnInit, OnDestroy, Input, OnChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CardDetailsRestrictionUpdateModalComponent} from '../card-details-restriction-update-modal/card-details-restriction-update-modal.component';
import {ApiCardService} from 'src/app/api-cards.service';
import {takeUntil} from 'rxjs/operators';
import {AllowedFuelProducts} from '../../shared/enums';
import {convertToSensitiveNumber} from '../../shared/common';
import {ICardRole} from 'src/shared/interfaces/card.interface';

@Component({
  selector: 'app-card-details-restriction',
  templateUrl: './card-details-restriction.html',
  styleUrls: ['./card-details-restriction.scss'],
})
export class CarddetailsRestrictionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() card: any;

  allowedFuelProducts: any;
  allSub: Subject<any> = new Subject<any>();
  message: string;
  messageType: string;
  loading: boolean;
  id: string;
  roles: ICardRole;
  convertToSensitiveNumber = convertToSensitiveNumber;

  constructor(private api: ApiCardService, private dialog: MatDialog) {}

  ngOnInit() {
    this.roles = this.api.getCardRolePermissions();
    this.allowedFuelProducts = Object.values(AllowedFuelProducts).map((item) => {
      if (
        (
          (this.card &&
            this.card.limitation &&
            this.card.limitation.allowedFuelProducts &&
            this.card.limitation.allowedFuelProducts) ||
          []
        ).includes(item)
      ) {
        return {
          value: item,
          checked: true,
        };
      } else {
        return {
          value: item,
          checked: false,
        };
      }
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  ngOnChanges() {}

  getDetails() {
    this.loading = true;
    this.api
      .readCard(this.card.id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.loading = false;
          this.card = res;
          this.allowedFuelProducts = Object.values(AllowedFuelProducts).map((item) => {
            if (
              (
                (this.card &&
                  this.card.limitation &&
                  this.card.limitation.allowedFuelProducts &&
                  this.card.limitation.allowedFuelProducts) ||
                []
              ).includes(item)
            ) {
              return {
                value: item,
                checked: true,
              };
            } else {
              return {
                value: item,
                checked: false,
              };
            }
          });
        },
        (err) => {
          console.log(err);
          this.loading = false;
        },
      );
  }

  openModal() {
    const dialogRef = this.dialog.open(CardDetailsRestrictionUpdateModalComponent, {
      data: {card: this.card},
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      if (res.isSuccess) {
        this.messageType = 'success';
        this.message = 'Fraud profile was updated successfully';
        this.getDetails();
      } else {
        this.messageType = 'error';
        this.message = res.data;
      }
    });
  }
}
