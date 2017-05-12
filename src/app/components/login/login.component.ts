import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/*Services*/
import { AuthenticationService } from './../../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  msg;

  constructor(
    private authentication: AuthenticationService, 
    public snackBar: MdSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    if(sessionStorage.getItem('email')) {
      window.location.href = '/home';
    }
  }

  login = (email, password) => {
    this.authentication.login(email, password)
    .then(res => {
      this.msg = res;

      this.snackBar.open(this.msg.message, '', {
        duration: 2000,
      });
      

      if(this.msg.cod == "l-01") {
        window.location.href = '/home';
      }
    })
    .catch(rej => {
      this.msg = rej;

      this.snackBar.open(this.msg.message, '', {
        duration: 3000,
      });
    })
  }
}
