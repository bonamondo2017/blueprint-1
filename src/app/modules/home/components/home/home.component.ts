import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthenticationService } from './../../../../shared/services/authentication.service';
import { CrudService } from './../../../../shared/services/crud.service';
import { initializeApp } from 'firebase';
import { firebaseConfig } from './../../../../../environments/firebase.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  msg: any;

  constructor(private authentication: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  logout = () => {
    this.authentication.logout()
    .then(res => {
      this.msg = res;

      if(this.msg.cod == "lo-01") {
        this.router.navigate(['/login']);
      }
    })
    .catch(rej => this.msg = [rej]);;
  }
}
