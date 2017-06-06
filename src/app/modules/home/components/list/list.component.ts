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
    this.toolbar = {
      title: "[toolbar.title]",
      search: true,
      delete: true,
      more: true
    };

    this.list = {
      source: 'firebase', 
      child: 'people', 
      fieldsToShow:['uid', 'name']
    };
  }

  ngOnInit() {
  }

}
