import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private breadcrumbs: BehaviorSubject<BreadcrumbItem[]> = new BehaviorSubject(null);
  constructor() {}

  public setBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
    this.breadcrumbs.next(breadcrumbs);
  }

  public clearBreadcrumbs() {
    this.breadcrumbs.next(null);
  }

  public getBreadcrumbs() {
    return this.breadcrumbs;
  }
}
