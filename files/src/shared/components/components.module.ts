import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {InputComponent} from './input/input.component';
import {ButtonComponent} from './button/button.component';
import {ContentComponent} from './content/content.component';
import {LoaderComponent} from './loader/loader.component';
import {MessageComponent} from './message/message.component';
import {SearchbarComponent} from './searchbar/searchbar.component';
import {DropdownComponent} from './dropdown/dropdown.component';
import {DatepickerComponent} from './datepicker/datepicker.component';
import {ComboBoxComponent} from './combo-box/combo-box.component';
import {ProfileCardStatusComponent} from './profile-card-status/profile-card-status.component';
import {JsonFormatterViewerComponent} from './json-formatter-viewer/json-formatter-viewer.component';
import {DisplayTextComponent} from './display-text/display-text.component';
import {RadioComponent} from './radio/radio.component';
import {CheckboxComponent} from './checkbox/checkbox.component';
import {PaginationComponent} from './pagination/pagination.component';
import {PipesModule} from '../pipes/pipes.module';
import {ButtonDownloadComponent} from './button-download/button-download.component';
import {ButtonIconComponent} from './button-icon/button-icon.component';
import {CollapseComponent} from './collapse/collapse.component';
import {ToggleComponent} from './toggle/toggle.component';
import {TimepickerComponent} from './timepicker/timepicker.component';
import {ModalAddPrefundingAlertComponent} from './modal-add-prefunding-alert/modal-add-prefunding-alert.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {ModalConfirmComponent} from './modal-confirm/modal-confirm.component';
import {SimplePaginationComponent} from './simple-pagination/simple-pagination.component';
import {StatusIndicatorComponent} from './status-indicator/status-indicator.component';
import {
  OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  OwlMomentDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import {DropdownSearchComponent} from './dropdown-search/dropdown-search.component';
import {HasPermissionDirective} from '../directives/has-permission.directive';
import {JsonViewerComponent} from './json-viewer/json-viewer.component';
import {JsonViewerModalComponent} from './json-viewer-modal/json-viewer-modal.component';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {ModalVoidVoucherComponent} from './modal-void-voucher/modal-void-voucher.component';
import {PaginatorComponent} from './paginator/paginator.component';
import {SeoComponent} from './seo/seo.component';
import {TagsComponent} from './tags/tags.component';
import {FilterContainerComponent} from './filter-container/filter-container.component';
import {FormTagsComponent} from './form-tags/form-tags.component';
import {MultipleTimeSlotsPickerComponent} from './multiple-time-slots-picker/multiple-time-slots-picker.component';
import {MerchantSearchSelectComponent} from './merchant-search-select/merchant-search-select';
import {MerchantSearchSelect2Component} from './merchant-search-select2/merchant-search-select2';
import {JsonEditModalComponent} from './json-edit-modal/json-edit-modal.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {BreadcrumbsComponent} from './breadcrumbs/breadcrumbs.component';
import {BreadcrumbsDirective} from './breadcrumbs/breadcrumbs.directive';
import {DirectivesModule} from '../directives/directives.module';

@NgModule({
  declarations: [
    HasPermissionDirective,
    InputComponent,
    ButtonComponent,
    ButtonDownloadComponent,
    LoaderComponent,
    MessageComponent,
    SearchbarComponent,
    DropdownComponent,
    DatepickerComponent,
    DisplayTextComponent,
    ProfileCardStatusComponent,
    JsonFormatterViewerComponent,
    RadioComponent,
    CheckboxComponent,
    ComboBoxComponent,
    PaginationComponent,
    ButtonIconComponent,
    CollapseComponent,
    ToggleComponent,
    TimepickerComponent,
    ModalAddPrefundingAlertComponent,
    FileUploadComponent,
    ModalConfirmComponent,
    SimplePaginationComponent,
    StatusIndicatorComponent,
    DropdownSearchComponent,
    JsonViewerComponent,
    JsonViewerModalComponent,
    ModalVoidVoucherComponent,
    PaginatorComponent,
    TagsComponent,
    FilterContainerComponent,
    FormTagsComponent,
    MultipleTimeSlotsPickerComponent,
    MerchantSearchSelectComponent,
    MerchantSearchSelect2Component,
    JsonEditModalComponent,
    ContentComponent,
    SidebarComponent,
    BreadcrumbsDirective,
    BreadcrumbsComponent,
    SeoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    NgxJsonViewerModule,
    MaterialModule,
    DirectivesModule,
  ],
  providers: [{provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: {useUtc: true}}],
  exports: [
    HasPermissionDirective,
    InputComponent,
    ButtonComponent,
    ButtonDownloadComponent,
    LoaderComponent,
    MessageComponent,
    SearchbarComponent,
    DropdownComponent,
    DatepickerComponent,
    DisplayTextComponent,
    ProfileCardStatusComponent,
    JsonFormatterViewerComponent,
    RadioComponent,
    CheckboxComponent,
    ComboBoxComponent,
    PaginationComponent,
    ButtonIconComponent,
    CollapseComponent,
    ToggleComponent,
    TimepickerComponent,
    ModalAddPrefundingAlertComponent,
    FileUploadComponent,
    ModalConfirmComponent,
    SimplePaginationComponent,
    StatusIndicatorComponent,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DropdownSearchComponent,
    JsonViewerComponent,
    JsonViewerModalComponent,
    ModalVoidVoucherComponent,
    PaginatorComponent,
    TagsComponent,
    FilterContainerComponent,
    FormTagsComponent,
    MultipleTimeSlotsPickerComponent,
    MerchantSearchSelectComponent,
    MerchantSearchSelect2Component,
    JsonEditModalComponent,
    ContentComponent,
    SidebarComponent,
    BreadcrumbsDirective,
    BreadcrumbsComponent,
    SeoComponent,
  ],
  entryComponents: [JsonViewerModalComponent, JsonEditModalComponent],
})
export class ComponentsModule {}
