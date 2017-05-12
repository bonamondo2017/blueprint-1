import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'menu-current-module',
  templateUrl: './menu-current-module.component.html',
  styleUrls: ['./menu-current-module.component.css']
})
export class MenuCurrentModuleComponent implements OnInit {
  public sidenav: boolean;
  constructor() { }

  ngOnInit() {
    this.sidenav = false;
  }

  toggleSidenav = () => {
    this.sidenav = !this.sidenav;
  }
}
