<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogClose, MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/*Components*/
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';

/*Services*/
import { AuthenticationService } from './../../services/authentication.service';

@Component({
  selector: 'bonamondo-login',
=======
import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogClose } from '@angular/material';

/*Validators*/
import { MyValidators } from './../../validators/my-validators';

@Component({
  selector: 'login',
>>>>>>> 085ac94f2ead1a8f49974abe0a17909ae2d83a99
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
<<<<<<< HEAD
  currentUser: any;
  msg;

  constructor(
    private authentication: AuthenticationService, 
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router
  ) { }

  ngOnInit() { }

  login = (email, password) => {
    this.authentication.login('firebase', email, password)
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
=======
  @Input() elementInfo;
  @Input() databaseInfo;

  error: any = [];
  loginForm: FormGroup;
  
  constructor() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    if(this.databaseInfo) {
      if(!this.databaseInfo.source) {
        this.error += ['databaseInfo.source']; //values to attribute: laravel, firebase
      }

      if(!this.databaseInfo.loginMode) {
        this.error += ['databaseInfo.loginMode']; //values to attribute: emailAndPassword, loginAndPassword, google, facebook
      }
    } else {
      this.error += ['databaseInfo']; //attributes to object: source, loginMode
    }

    if(this.elementInfo.titleText && this.elementInfo.titleImage) {
      this.error += ['elementInfo.titleText AND elementInfo.titleImage can\'t be used together'];
    }
  }

>>>>>>> 085ac94f2ead1a8f49974abe0a17909ae2d83a99
}
