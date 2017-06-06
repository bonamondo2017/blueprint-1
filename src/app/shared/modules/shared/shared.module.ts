import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

/*Components*/
import { DeleteConfirmComponent } from './../../components/delete-confirm/delete-confirm.component';
import { ForgotPasswordComponent } from './../../components/forgot-password/forgot-password.component';
import { FormMultipleAutocompleteComponent } from './../../components/form-multiple-autocomplete/form-multiple-autocomplete.component';
import { PageNotFoundComponent } from './../../components/page-not-found/page-not-found.component';
import { TableListComponent } from './../../components/table-list/table-list.component';

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
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    FormMultipleAutocompleteComponent,
    FormMultipleselectAutocompleteDirective,
    PageNotFoundComponent,
    SearchByNamePipe,
    TableListComponent
  ],
  exports: [
    MaterialModule,
    DeleteConfirmComponent,
    ForgotPasswordComponent,
    FormMultipleAutocompleteComponent,
    FormMultipleselectAutocompleteDirective,
    PageNotFoundComponent,
    SearchByNamePipe,
    TableListComponent
  ],
  providers: [
    AuthenticationService,
    CrudService,
    MyValidators
  ],
  entryComponents: [
    DeleteConfirmComponent,
    ForgotPasswordComponent
  ]
})
export class SharedModule { }
