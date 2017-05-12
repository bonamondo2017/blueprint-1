import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*Components*/
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';

/*Modules*/
import { RoutingModule } from './modules/routing/routing.module';
import { SharedModule } from './../../shared/modules/shared/shared.module';

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
    ProfileComponent,
    HomeComponent
  ]
})

export class HomeModule { }
