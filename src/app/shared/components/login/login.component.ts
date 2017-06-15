import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogClose } from '@angular/material';

/*Validators*/
import { MyValidators } from './../../validators/my-validators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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

}
