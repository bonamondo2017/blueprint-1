import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {  PageEvent } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit {
  @Input('data') data:any[] = null;
  @ViewChild('paginator') paginator;
  @Input('config') config: any;
  @Output('changed') changed: EventEmitter<any> = new EventEmitter();
  fieldsLength;
  checkeds: any;
  selected = [];
  constructor(private router: Router){
  }
  ngOnInit() {
    console.log(this.paginator);
  }
  ngOnChange(){    
    this.data = this.data.map(row => {
      row['checked'] = false;
      return row;
    });

    this.fieldsLength = this.config.fields.length + 1;

    if(this.config.permission.length > 0) {
      this.fieldsLength = this.config.fields.length + 2;
    }

    console.log(this.fieldsLength);
  }

  changeSort(fieldName){
    if(this.config.sort.field == fieldName){
      this.config.sort.order = this.config.sort.order == "asc" ? "desc" : "asc";
    }
    this.config.sort.field = fieldName;
    this.changed.emit();
  }

  changedPage(pageEvent: PageEvent){
    if(this.config.pageSize != pageEvent.pageSize ||
      this.config.page != pageEvent.pageIndex + 1
    ){
      this.config.pageSize = pageEvent.pageSize;
      this.config.page = pageEvent.pageIndex + 1;
      this.changed.emit(pageEvent);
    }
  }
  edit(id: any): any {
    return  this.router.navigate(['add', id]);
  }

  view(id: any): any {
    return  this.router.navigate(['view', id]);
  }


}
