import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public toolbar: any;
  public list: any;

  constructor() {
    this.list = {
      source: 'firebase', 
      child: 'people', 
      childKeys:['uid', 'name'],
      header: ['Id', 'Nome'],
      edit: true
    };
  }

  ngOnInit() {
  }

}
