import {Directive, Input, TemplateRef, ViewContainerRef, OnInit} from '@angular/core';
import {AuthService} from 'src/app/auth.service';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective implements OnInit {
  @Input()
  appHasPermission: string[];
  @Input()
  appHasPermissionElse: TemplateRef<any>;
  @Input()
  or: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    protected authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.hasAccess()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.appHasPermissionElse) {
      this.viewContainer.createEmbeddedView(this.appHasPermissionElse);
    } else {
      this.viewContainer.clear();
    }
  }

  hasAccess() {
    if (!this.or) {
      return this.authService.validatePermissions(this.appHasPermission);
    }
    return this.appHasPermission.some((permission) =>
      this.authService.validatePermissions(permission),
    );
  }
}
