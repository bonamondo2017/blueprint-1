import { Component } from '@angular/core';

/*Firebase*/
import { configBlueprint } from '../environments/firebase.config';
import { initializeApp } from 'firebase';

/*Services*/
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    initializeApp(configBlueprint);
  }
}
