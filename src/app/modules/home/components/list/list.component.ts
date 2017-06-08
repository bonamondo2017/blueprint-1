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
    this.crudParams = {
      child: 'people', 
      childKeys:['uid', 'name']  
    }

    /*this.list = {
      source: 'firebase', 
      child: 'people', 
      childKeys:['uid', 'name'],
      header: ['Id', 'Nome'],
      edit: true
    };*/

    this.crud.readArray(this.crudParams)
    .then(res => {
      this.list = {
        source: 'array',
        array: res,
        childKeys:['uid', 'name'],
        edit: true,
        header: ['Id', 'Nome']
      }
    })
  }

  ngOnInit() {
  }

}
