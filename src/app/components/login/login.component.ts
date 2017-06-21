import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
<<<<<<< HEAD
=======
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
>>>>>>> 085ac94f2ead1a8f49974abe0a17909ae2d83a99

  constructor() { }

  ngOnInit() {
  }

}