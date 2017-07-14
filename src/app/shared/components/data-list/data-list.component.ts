import { Component, DoCheck, Input, OnInit, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import {  PageEvent } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit, OnChanges, DoCheck {
  @Input('data') data:any[];
  @ViewChild('paginator') paginator;
  @Input('config') config: any;
  @Output('changed') changed: EventEmitter<any> = new EventEmitter();

  fieldsLength: any;
  allSelected: boolean = false; 

  constructor(private router: Router){
  }

  ngOnInit() {
    /*Paginator*/
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';

    if(!this.config.paginatorPageIndex)
      this.config.paginatorPageIndex = 1;

    if(!this.config.paginatorPageSize) 
      this.config.paginatorPageSize = 5;
    
    if(!this.config.paginatorPageSizeOptions)
      this.config.paginatorPageSizeOptions = [5, 10, 15, 20, 25];
    /*Paginator end*/
  }

  ngDoCheck () {
    if(this.data) {
      this.data = this.data.map(row => {
        row['_checked'] = false;
        return row;
      });

      /**
       * DEFAULT VALUES
       */
      /*Paginator*/
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';

      if(!this.config.paginatorLength)
        this.config.paginatorLength = this.data.length;

      if(!this.config.paginatorPageIndex)
        this.config.paginatorPageIndex = 1;

      if(!this.config.paginatorPageSize)
        this.config.paginatorPageSize = 5;

      if(!this.config.paginatorPageSizeOptions)
        this.config.paginatorPageSizeOptions = [5, 10, 15, 20, 25];
      /*Paginator end*/

      if(!this.config.isLoading)
        this.config.isLoading = false;

      if(!this.config.sort)
        this.config.sort = { order: "asc", field: "id" };
    }
    /**
     * DEFAULT VALUES END
     */
  }

  ngOnChanges() {
    if(this.config) {
      // colspan. O +1 é por conta do th de actions em cada linha, que sempre existirá
      this.fieldsLength = this.config.fields.length + 1;
      
      if(this.config.permission.delete) {
        // colspan. O +2 é por conta do th de actions em cada linha, que sempre existirá, e da colunha
        // de checkboxes que surgirá, para atender à action delete
        this.fieldsLength += 1; 
      }
    }
  }

  changeSort = (fieldName) => {
    if(this.config.sort.field == fieldName){
      this.config.sort.order = this.config.sort.order == "asc" ? "desc" : "asc";
    }
    this.config.sort.field = fieldName;
    this.changed.emit({type: 'sort', changed: this.config.sort});
  }

  changedPage = (pageEvent: PageEvent) => {
    if(this.config.paginatorPageSize != pageEvent.pageSize ||
      this.config.paginatorPageIndex != pageEvent.pageIndex + 1
    ){
      this.config.paginatorPageSize = pageEvent.pageSize;
      this.config.paginatorPageIndex = pageEvent.pageIndex + 1;
      this.changed.emit({type: 'page', changed: pageEvent});
    }
  }
  
  changedCheckbox = (rowIndex, event) => {
    this.data[rowIndex]._checked = event.checked;

    for(let lim = this.data.length, i = 0; i < lim; i++) {
      if(!this.data[i]._checked) {
        this.allSelected = false;
        return this.triggerSelecteds();
      }
    }
    this.allSelected = true;
    return this.triggerSelecteds();
  }

  toggleSelectAll = ($event) => {
    this.allSelected = $event.checked;
    for(let lim = this.data.length, i = 0; i < lim; i++) {
      this.data[i]._checked = this.allSelected;
    }
    this.triggerSelecteds();
  }
  
  triggerSelecteds(){
    this.changed.emit({
        type: 'selecteds', 
        changed: this.data.filter(row => row._checked)
    });
  }

  edit = (rowIndex) => {
    let defaultRoute = this.router.url;
    let userRoute = this.config.editUrl
    let route;
    let defaultId = this.data[rowIndex]['id'];
    let userId = this.data[rowIndex][this.config.editIdField]; 
    let id;

    this.config.editUrl ? route = userRoute : route = defaultRoute ;

    this.config.editIdField ? id = userId : id = defaultId ;

    this.router.navigate([route, id]);
  }

  view = (rowIndex) => {
    let defaultRoute = this.router.url + "/view";
    let userRoute = this.config.viewUrl;
    let route;
    let defaultId = this.data[rowIndex]['id'];
    let userId = this.data[rowIndex][this.config.viewIdField]; 
    let id;

    this.config.editUrl ? route = userRoute : route = defaultRoute ;

    this.config.editIdField ? id = userId : id = defaultId ;
      
    this.router.navigate([route, id]);
  }
}