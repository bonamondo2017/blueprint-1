import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*Components*/
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormComponent } from './components/form/form.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';

/*Modules*/
import { RoutingModule } from './modules/routing/routing.module';
import { SharedModule } from './../../shared/modules/shared/shared.module';
import { InvitationComponent } from './components/invitation/invitation.component';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    DashboardComponent,
    FormComponent,
    ProfileComponent,
    HomeComponent,
    InvitationComponent
  ]
})

export class HomeModule { }
