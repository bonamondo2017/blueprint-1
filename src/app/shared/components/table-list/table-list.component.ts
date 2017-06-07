import { Component, OnInit, Input, OnChanges } from '@angular/core';

/*Serices*/
import { CrudService } from './../../services/crud.service';

@Component({
  selector: 'table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnChanges{
  @Input() toolbar;
  @Input() list;

  arrayHeader: any = [];
  arraySource: any = [];
  arraySourceFinal: any = [];
  error: any = [];
  msg: string;
  isLoadingList: boolean = true;
  
  constructor(
    private crud: CrudService
  ) { }
  ngOnChanges(){
     if(this.list) {
      switch(this.list.source) {
        case 'firebase':
          if(this.list.child) {
            if(this.list.childKeys) {
              this.crud.readArray({ 
                child: this.list.child,
                keys: this.list.childKeys
              })
              .then(res => {
                this.isLoadingList = false;
                this.arraySource = res;
                this.filterArrayKey(this.arraySource);
                if(this.arraySource.length < 1) {
                  this.msg = "Nada na lista";
                }
              });            
            } else {
              this.error = ['list.childKeys']  
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

      if(this.list.header) {
        this.arrayHeader = this.list.header;
      } else {
        this.error = ['list.header']  
      }
    } else {
      this.error = ['list']
    }
  }

  
  filterArrayKey(data){
    let filter = data.map((data) => {
      let temp = [];
      for(let lim = this.list.childKeys.length, i = 0; i < lim; i++){
        temp.push(data[this.list.childKeys[i]]);
      }
      return temp;
    })

    this.arraySourceFinal = filter; 
  }
}
