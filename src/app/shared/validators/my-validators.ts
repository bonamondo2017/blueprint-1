import { FormControl } from '@angular/forms';

import { AuthenticationService } from './../services/authentication.service';

export class MyValidators {
  cpf = (control: FormControl) => {
    let CPF_REGEXP = /^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$/;
    let sum;
    let remainder;
    let cpfNumbers;
    let cpfValidator;
    
    if (control.value) {
      /*Validation algorithm starting*/
      cpfNumbers = control.value.replace(/\D/g,'');
      cpfValidator = true;
      sum = 0;
      
      if (cpfNumbers == "00000000000") cpfValidator = false;

      for (let i=1; i<=9; i++) sum = sum + parseInt(cpfNumbers.substring(i-1, i)) * (11 - i);
      remainder = (sum * 10) % 11;

      if ((remainder == 10) || (remainder == 11))  remainder = 0;
      if (remainder != parseInt(cpfNumbers.substring(9, 10)) ) cpfValidator = false;

      sum = 0;
      for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpfNumbers.substring(i-1, i)) * (12 - i);
      remainder = (sum * 10) % 11;

      if ((remainder == 10) || (remainder == 11))  remainder = 0;
      if (remainder != parseInt(cpfNumbers.substring(10, 11) ) ) cpfValidator = false;
      /*Validation algorithm finishing*/
      
      if (control.value != "" && (!CPF_REGEXP.test(control.value) || !cpfValidator)) {
        return { "Please provide a valid cpf": true };
      }
    }

    return null;
  }

  email = (control: FormControl) => {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (control.value) {
      if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
        return { "Please provide a valid email": true };
      }
    }

    return null;
  }
}
