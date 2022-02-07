import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ApiReportsService} from 'src/app/api-reports-service';
import {formatDate} from 'src/shared/helpers/common';
import {AppFormGroup, AppFormBuilder, AppValidators} from 'src/shared/helpers/formGroup';
import {Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-customer-funnel',
  templateUrl: './customer-funnel.html',
  styleUrls: ['./customer-funnel.scss'],
})
export class CustomerFunnelComponent implements OnInit {
  loading = {
    full: false,
    page: false,

    get any() {
      return this.full || this.page;
    },

    stop() {
      this.full = this.page = false;
    },
  };
  allSub: Subject<any> = new Subject<any>();

  errorMessage;
  form: AppFormGroup;
  isLoading;

  downloadCsv: Subject<string> = new Subject<string>();

  constructor(private apiReportsService: ApiReportsService, private fb: AppFormBuilder) {
    this.form = this.fb.group({
      createdUsersFrom: ['', [Validators.required]],
      createdUsersTo: ['', [Validators.required]],
    });

    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
  }

  ngOnInit() {}

  formDownloadCsv() {
    if (this.isLoading) {
      return;
    }

    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const {createdUsersFrom, createdUsersTo} = this.form.value;
    this.apiReportsService
      .userFunnel(formatDate(createdUsersFrom), formatDate(createdUsersTo, true))
      .pipe(takeUntil(this.allSub))
      .subscribe((url) => {
        this.downloadCsv.next(url);
        this.isLoading = false;
      });
  }
}
