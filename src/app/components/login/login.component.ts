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
      source: 'laravel',
      loginMode: 'emailAndPassword'
    }
  }

  ngOnInit() { }
}