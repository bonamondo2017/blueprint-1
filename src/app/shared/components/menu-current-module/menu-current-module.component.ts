import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/*Services*/
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'menu-current-module',
  templateUrl: './menu-current-module.component.html',
  styleUrls: ['./menu-current-module.component.css']
})
export class MenuCurrentModuleComponent implements OnInit {
  public msg: any;
  public sidenav: boolean;

  constructor(
    private authentication: AuthenticationService, 
    public snackBar: MdSnackBar,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.sidenav = false;
  }

  logout = () => {
    this.authentication.logout()
    .then(res => {
      this.msg = res;

      this.snackBar.open(this.msg.message, '', {
        duration: 2000,
      });

      if(this.msg.cod == "lo-01") {
        this.router.navigate(['/login']);
      }
    })
    .catch(rej => this.msg = [rej]);;
  }

  toggleSidenav = () => {
    this.sidenav = !this.sidenav;
  }
}
