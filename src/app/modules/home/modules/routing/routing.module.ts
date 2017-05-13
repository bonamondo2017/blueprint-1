import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './../../components/dashboard/dashboard.component';
import { FormComponent } from './../../components/form/form.component';
import { HomeComponent } from './../../components/home/home.component';
import { ProfileComponent } from './../../components/profile/profile.component';

export const routes: Routes = [{
  path: '', component: HomeComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'form', component: FormComponent },
    { path: 'profile', component: ProfileComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RoutingModule { }