import {Component, OnInit} from '@angular/core';
import {JsonEditModalComponent} from '../../../../shared/components/json-edit-modal/json-edit-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiVariablesService} from '../../../api-variables-.service';
import {
  IAppSettings,
  IExperienceAppSettingsRole,
} from '../../../../shared/interfaces/variables.interface';

@Component({
  moduleId: module.id,
  selector: 'app-global-variables',
  templateUrl: 'global-variables.component.html',
  styleUrls: ['global-variables.component.scss'],
})
export class GlobalVariablesComponent implements OnInit {
  appSettings: IAppSettings;
  roles: IExperienceAppSettingsRole;

  constructor(
    private apiVariablesService: ApiVariablesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.roles = this.apiVariablesService.getRolePermissions();
    this.loadAppSettings();
  }

  loadAppSettings() {
    this.apiVariablesService.getAppSettings().subscribe((data) => {
      this.appSettings = data;
    });
  }

  ngOnDestory() {}

  onUpdateVariable() {
    const dialogRef = this.dialog.open(JsonEditModalComponent, {
      width: '900px',
      height: '700px',
      data: this.appSettings || {},
    });

    dialogRef.afterClosed().subscribe((modalRes) => {
      if (!modalRes) {
        return;
      }

      this.apiVariablesService.createOrUpdateAppSettings(modalRes).subscribe(
        () => {
          this.snackBar.open(`Successfully updated`, 'OK', {duration: 5000});
          this.loadAppSettings();
        },
        (err) => {
          this.snackBar.open(`Error occured. ${err.error.description}`, 'OK', {duration: 5000});
        },
      );
    });
  }
}
