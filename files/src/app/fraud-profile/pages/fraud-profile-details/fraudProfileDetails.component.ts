import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ApiBlacklistService} from 'src/app/api-blacklist-service';
import {MatDialog} from '@angular/material/dialog';
import {FraudProfileModalComponent} from '../fraud-profile-modal/fraudProfileModal.component';
import {IFraudRole} from 'src/shared/interfaces/fraud.interface';

@Component({
  selector: 'app-fraud-profile-details',
  templateUrl: './fraudProfileDetails.component.html',
  styleUrls: ['./fraudProfileDetails.component.scss'],
})
export class FraudProfileDetailsComponent implements OnDestroy {
  id: string;
  details: any;

  loading: boolean;
  allSub: Subject<any> = new Subject<any>();

  message: string;
  messageType: string;
  roles: IFraudRole;

  constructor(route: ActivatedRoute, private api: ApiBlacklistService, private dialog: MatDialog) {
    this.initSessionRoles();
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.id = param.id;
      this.getDetails();
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.api.getRolePermissions();
  }

  getDetails() {
    this.loading = true;
    this.api
      .getFraudProfileById(this.id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.loading = false;
          this.details = res;
        },
        () => {
          this.loading = false;
        },
      );
  }

  openModal($event) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(FraudProfileModalComponent, {
      data: this.details,
      width: '820px',
      height: '470px',
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
