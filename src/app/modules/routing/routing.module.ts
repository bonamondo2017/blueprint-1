import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*Components*/
import { LoginComponent } from './../../components/login/login.component';
import { PageNotFoundComponent } from './../../shared/components/page-not-found/page-not-found.component';
import { SignupComponent } from './../../components/signup/signup.component';

/*Guards*/
import { AuthGuard } from './../../shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'home',
    loadChildren: './../home/home.module#HomeModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class RoutingModule {}