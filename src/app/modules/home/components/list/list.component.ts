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
  public crudParams: any;
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

    /*//Eliminate crud service and everything envolved
    this.list = {
      source: 'firebase', 
      child: 'people', 
      childKeys:['uid', 'name'],
      header: ['Id', 'Nome'],
      edit: true
    };*/

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
    })
  }

  ngOnInit() {
  }

}
