import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

/*Components*/
import { DeleteConfirmComponent } from './../../components/delete-confirm/delete-confirm.component';
import { MenuCurrentModuleComponent } from './../../components/menu-current-module/menu-current-module.component';
import { PageNotFoundComponent } from './../../components/page-not-found/page-not-found.component';

/*Pipes*/
import { SearchByNamePipe } from './../../pipes/search-by-name.pipe';

/*Services*/
import { AuthenticationService } from './../../services/authentication.service';

/*Validators*/
import { MyValidators } from './../../validators/my-validators';

/*Third party packages*/
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TextMaskModule
  ],
  declarations: [
    DeleteConfirmComponent,
    MenuCurrentModuleComponent,
    PageNotFoundComponent,
    SearchByNamePipe
  ],
  exports: [
    MaterialModule,
    DeleteConfirmComponent,
    MenuCurrentModuleComponent,
    PageNotFoundComponent,
    SearchByNamePipe
  ],
  providers: [
    AuthenticationService,
    MyValidators
  ],
  entryComponents: [
    DeleteConfirmComponent,
    MenuCurrentModuleComponent
  ]
})
export class SharedModule { }
