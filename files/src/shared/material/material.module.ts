import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatMenuModule} from '@angular/material/menu';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';

const reexport = [
  MatNativeDateModule,
  MatRippleModule,
  MatSelectModule,
  MatCardModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatTableModule,
  MatIconModule,
  MatListModule,
  MatButtonModule,
  MatChipsModule,
  MatDividerModule,
  MatTableModule,
  MatTooltipModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatRadioModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatStepperModule,
  MatMenuModule,
  NgxMatSelectSearchModule,
];

@NgModule({
  imports: [CommonModule, ...reexport],
  exports: reexport,
})
export class MaterialModule {}
