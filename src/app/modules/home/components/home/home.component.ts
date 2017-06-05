import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/*Services*/
import { AuthenticationService } from './../../../../shared/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  currentUser: any;

  constructor(private router: Router, private authentication: AuthenticationService) { }

  ngOnInit() {
  }

  logout = () => {
    this.authentication.logout();
    this.router.navigate(['/login']);
  }
}
