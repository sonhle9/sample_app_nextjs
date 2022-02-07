import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ReactFetchInterceptorService} from './react-fetch-interceptor.service';
import {TestHelperService} from './test-helper.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  allSub: Subject<any> = new Subject<any>();

  constructor(
    private fetchService: ReactFetchInterceptorService,
    private readonly testHelperService: TestHelperService,
  ) {}

  async ngOnInit() {
    this.fetchService.startInterceptions();
    this.testHelperService.attachHelperInTestingEnv();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }
}
