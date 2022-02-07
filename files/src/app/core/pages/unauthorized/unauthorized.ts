import {Component, OnInit, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from 'src/app/auth.service';
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-unauthorized',
  templateUrl: 'unauthorized.html',
  styleUrls: ['unauthorized.scss'],
})
export class UnauthorizedComponent implements OnInit, OnDestroy {
  messageContent = '';
  allSub: Subject<any> = new Subject<any>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  routeHome() {
    this.router.navigate(['/']).catch(() => {
      this.messageContent = 'Permission Denied';
    });
  }

  logOut() {
    this.authService
      .logout()
      .pipe(takeUntil(this.allSub))
      .subscribe(() => {});
    this.router.navigate(['/login']);
  }
}
