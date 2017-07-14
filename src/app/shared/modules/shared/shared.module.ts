import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

/*Components*/
import { DataListComponent } from './../../components/data-list/data-list.component';
import { DeleteConfirmComponent } from './../../components/delete-confirm/delete-confirm.component';
import { ForgotPasswordComponent } from './../../components/forgot-password/forgot-password.component';
import { FormMultipleAutocompleteComponent } from './../../components/form-multiple-autocomplete/form-multiple-autocomplete.component';
import { LoginComponent } from './../../components/login/login.component';
import { PageNotFoundComponent } from './../../components/page-not-found/page-not-found.component';
import { ScheduleComponent } from './../../components/schedule/schedule.component';
import { ScheduleDialogComponent } from './../../components/schedule-dialog/schedule-dialog.component';
import { TableListComponent } from './../../components/table-list/table-list.component';
import { UploadComponent } from './../../components/upload/upload.component';
import { UploadDialogComponent } from './../../components/upload-dialog/upload-dialog.component';

/*Directives*/
import { FormMultipleselectAutocompleteDirective } from './../../directives/form-multipleselect-autocomplete.directive';

/*Pipes*/
import { SearchByNamePipe } from './../../pipes/search-by-name.pipe';

/*Services*/
import { AuthenticationService } from './../../services/authentication.service';
import { CrudService } from './../../services/crud.service';

/*Validators*/
import { MyValidators } from './../../validators/my-validators';

/*Third party packages*/
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    TextMaskModule
  ],
  declarations: [
    DataListComponent,
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    FormMultipleAutocompleteComponent,
    FormMultipleselectAutocompleteDirective,
    LoginComponent,
    PageNotFoundComponent,
    ScheduleComponent,
    ScheduleDialogComponent,
    SearchByNamePipe,
    TableListComponent,
    UploadComponent,
    UploadDialogComponent
  ],
  exports: [
    MaterialModule,
    DataListComponent,
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    FormMultipleAutocompleteComponent,
    FormMultipleselectAutocompleteDirective,
    LoginComponent,
    PageNotFoundComponent,
    ScheduleComponent,
    ScheduleDialogComponent,
    SearchByNamePipe,
    TableListComponent,
    UploadComponent,
    UploadDialogComponent
  ],
  providers: [
    AuthenticationService,
    CrudService,
    MyValidators
  ],
  entryComponents: [
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    ScheduleDialogComponent,
    UploadDialogComponent
  ]
})
export class SharedModule { }
