import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogClose } from '@angular/material';

/*Validators*/
import { MyValidators } from './../../shared/validators/my-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private myValidators: MyValidators) {
    this.signupForm = new FormGroup({
      'field_1_name': new FormControl('', [Validators.required, Validators.minLength(10)]),
      'field_0_email': new FormControl('', [Validators.required, this.myValidators.email]),
      'field_0_password': new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit() {
  }

}
