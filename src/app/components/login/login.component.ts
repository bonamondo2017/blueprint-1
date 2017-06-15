import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogClose, MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/*Components*/
import { ForgotPasswordComponent } from './../../shared/components/forgot-password/forgot-password.component';

/*Services*/
import { AuthenticationService } from './../../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentUser: any;
  databaseInfo: any;
  msg;

  constructor(
    private authentication: AuthenticationService, 
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router
  ) {
    this.databaseInfo = {
      source: 'firebase',
      loginMode: 'emailAndPassword'
    }
  }

  ngOnInit() { }

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

  forgotPassword = () => {
    let dialogRef = this.dialog.open(
      ForgotPasswordComponent
    );
    
    dialogRef.afterClosed().subscribe(() => {
    });
  }
}
