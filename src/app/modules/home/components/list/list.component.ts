import { Component, OnInit } from '@angular/core';

/*Services*/
import { CrudService } from './../../../../shared/services/crud.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public array: any;
  public configList: any;
  public crudParams: any;
  public data: any;
  public list: any;
  public toolbar: any;


  constructor(
    private crud: CrudService
  ) {
    //Firebase
    this.crudParams = {
      route: 'people'
    }

    /*//Laravel
    this.crudParams = {
      route: 'users'
    }*/

    /*TO COMPONENT BONAMONDO-TABLE-LIST
    //Eliminate crud service and everything envolved
    this.list = {
      source: 'firebase', 
      child: 'people', 
      childKeys:['uid', 'name'],
      header: ['Id', 'Nome'],
      edit: true
    };

    this.crud.readArray('firebase', this.crudParams)
    .then(res => {
      this.list = {
        source: 'array',
        array: res,
        show:['name'],
        edit: {route: '/teste', field: 'uid'},
        header: ['Nome'],
        colorByData: [{field: 'uid', fieldValue: 'Zk5DbpCX3MRl4klQT4ioMQySRep2', backgroundColor: '#de0800', color: '#fff'}]
      }
    })*/

    /* TO COMPONENT DATA-LIST */
    this.crud.readArray('firebase', this.crudParams)
    .then(res => {
      this.data = res;
      
      for(let lim = Object.keys(this.data).length, i = 0; i < lim; i++) {
        if(this.data[i].uid === "Zk5DbpCX3MRl4klQT4ioMQySRep2") {
          this.data[i]['styleRow'] = {backgroundColor: "pink"};
        }
      }
      
      console.log(this.data);
    })
  }

  ngOnInit() {
    this.configList = {
      length: null,
      isLoading: false,
      permission: null, //{create: boolean, view: boolean, update: boolean, delete: boolean}
      pageSize: 5,
      pageSizeOptions: [5, 10, 15, 20, 25],
      page:1,
      sort: {
        order: "asc",
        field: "id"
      },
      fields: [
        {field: "name", title: "Nome", sort: false},
        {field: "uid", title: "COD", sort: false}        
      ]
    }
  }

}
