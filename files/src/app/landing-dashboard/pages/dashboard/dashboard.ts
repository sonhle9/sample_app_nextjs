import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/app/auth.service';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {ISessionData} from 'src/shared/interfaces/auth.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  session: ISessionData;

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    this.session = this.authService.getSessionData();
  }

  get dashboardIcon(): string {
    const {icon} = CURRENT_ENTERPRISE;
    return icon;
  }

  ngOnDestroy() {}
}
