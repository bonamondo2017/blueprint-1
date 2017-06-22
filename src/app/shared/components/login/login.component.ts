import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogClose, MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/*Components*/
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';

/*Services*/
import { AuthenticationService } from './../../services/authentication.service';

/*Validators*/
import { MyValidators } from './../../validators/my-validators';

@Component({
  selector: 'bonamondo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() elementInfo;
  @Input() databaseInfo;

  error: any = [];
  loginForm: FormGroup;
  msg: any;
  
  constructor(
    private authentication: AuthenticationService, 
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router
  ) {
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

  onSubmit = () => {
    let email = this.loginForm.controls.email.value;
    let password = this.loginForm.controls.password.value;
    
    this.authentication.login(this.databaseInfo.source, { login: email, password: password, loginMode: this.databaseInfo.loginMode })
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