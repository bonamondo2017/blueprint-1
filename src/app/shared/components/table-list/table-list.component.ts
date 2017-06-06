import { Component, OnInit, Input } from '@angular/core';

/*Serices*/
import { CrudService } from './../../services/crud.service';

@Component({
  selector: 'table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  @Input() toolbar;
  @Input() list;

  array: any = [];
  error: any = [];
  
  constructor(
    private crud: CrudService
  ) { }

  ngOnInit() {
    if(this.list) {
      switch(this.list.source) {
        case 'firebase':
          if(this.list.child) {
            if(this.list.fieldsToShow) {
              this.crud.readArray({ child: this.list.child })
              .then(res => {
                this.array = res;
                console.log(this.array);
              });           
            
            } else {
              this.error = ['list.fieldsToShow']  
            }
          } else {
            this.error = ['list.child']
          }
        break;

        case 'arrayInComponent':
        break;

        default:
          this.error = ['list.source'] ;
      }
    } else {
      this.error = ['list']
    }
  }

}
