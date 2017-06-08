import { Component, OnInit, Input, OnChanges } from '@angular/core';

/*Serices*/
import { CrudService } from './../../services/crud.service';

@Component({
  selector: 'table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnChanges, OnInit{
  @Input() toolbar;
  @Input() list;

  arrayHeader: any = [];
  arraySource: any = [];
  arraySourceFinal: any = [];
  error: any = [];
  isLoadingList: boolean = true;
  msg: string;
  rows: any = [];
  pages: any = [];
  selectedPageValue: number;
  selectedRowValue: number;
  
  constructor(
    private crud: CrudService
  ) {
    this.selectedPageValue = 1;
    this.selectedRowValue = 1;
    this.rows = [1, 5, 10, 15, 20, 50, 100, 150, 200];
  }

  ngOnChanges() {
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

        case 'array':
          if(this.list.array) {
            this.isLoadingList = false;
            this.arraySource = this.list.array;
            this.filterArrayKey(this.arraySource);
            if(this.arraySource.length < 1) {
              this.msg = "Nada na lista";
            }
          } else {
            this.error = ['list.array']
          }
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
      setTimeout(() => {
        if(this.list == undefined) {
          this.error = ['list', 'time exceeded'];
        }
      }, 20000)
    }
  }

  ngOnInit() {
   
  }
  
  filterArrayKey = (data) => {
    //Set pages array - find a better place for it
    for(let lim = Math.ceil(data.length / this.selectedRowValue), i = 0; i < lim; i++) {
      this.pages[i] = i+1;
    }

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
