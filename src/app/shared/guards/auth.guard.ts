import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

/*Firebase*/
import { fbAuth } from './../../../environments/firebase-auth.config';

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
    fbAuth.onAuthStateChanged((user) => {
      if(!user) {
        this.router.navigate(['/login']);
      }
    });
    
    return true;
  }
}
