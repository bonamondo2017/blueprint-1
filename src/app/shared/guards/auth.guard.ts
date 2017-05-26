import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

/*Services*/
import { AuthenticationService } from './../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  teste: any;
  constructor(
    private auth: AuthenticationService, 
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.teste = this.auth.getCurrentUser();
    /*.then(res => {
      this.teste = res;
      
      console.log(this.teste);
    });*/
    /*let validate;
    validate = this.auth.currentUser();

    if(validate === undefined) {
      this.router.navigate(['/login']);
    }*/

    return true;
  }
}
