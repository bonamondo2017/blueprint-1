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
  somethingChildForm: FormGroup;
  
  constructor() {
    this.somethingChildForm = new FormGroup({
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

}
