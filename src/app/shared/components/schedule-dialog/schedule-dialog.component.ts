import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MdDialogRef } from '@angular/material';

/*Serices*/
import { CrudService } from './../../services/crud.service';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.css']
})
export class ScheduleDialogComponent implements DoCheck, OnInit {
  data: any;
  dialogText: string;
  
  constructor(
    private crud: CrudService,
    public dialogRef: MdDialogRef<any>,
    private http: Http
  ) {
    
    //this.data = this.dialogRef._containerInstance.dialogConfig.data;
  }

  ngOnInit() {
    console.log(this.dialogRef.componentInstance);
    this.dialogText;
  }

  ngDoCheck() {
    
    if(this.data) {
      console.log(this.data);
    }
  }
}
