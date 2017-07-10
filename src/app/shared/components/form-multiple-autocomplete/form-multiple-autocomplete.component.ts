import { Component, Input, OnChanges, OnInit } from '@angular/core';

/*Serices*/
import { CrudService } from './../../services/crud.service';

@Component({
  selector: 'form-multiple-autocomplete',
  templateUrl: './form-multiple-autocomplete.component.html',
  styleUrls: ['./form-multiple-autocomplete.component.css']
})
export class FormMultipleAutocompleteComponent implements OnChanges, OnInit {
  @Input() arraySource: any;
  @Input() class: string;

  array: any = [];
  arraySourceFinal: any = [];
  error: any = [];

  constructor(
    private crud: CrudService
  ) {
  }

  ngOnChanges() {
    if(this.arraySource) {
      switch(this.arraySource.source) {
        case 'firebase':
          if(this.arraySource.child) {
            if(this.arraySource.childKeys) {
              this.crud.readArray('firebase', {
                child: this.arraySource.child,
                keys: this.arraySource.childKeys
              })
              .then(res => {
                this.array = res;
                this.arraySourceFinal = res;
                //this.filterArrayKey(this.array);
              });           
            
            } else {
              this.error = ['arraySource.childKeys']  
            }
          } else {
            this.error = ['arraySource.child']
          }
        break;

        case 'array':
          if(this.arraySource.array) {
            this.array = this.arraySource.array;
            
            let filter = this.array.obj.map(data => {
              let keys = Object.keys(data);
              let temp = [];
              
              for(let lim = keys.length, i = 0; i < lim; i++) {
                temp[keys[i]] = data[keys[i]];
              }

              return temp;
            })
            
            this.filterArrayKey(filter);
          } else {
            this.error = ['arraySource.array']
          }
        break;

        default:
          this.error = ['arraySource.source'] ;
      }
    } else {
      setTimeout(() => {
        if(this.arraySource == undefined) {
          this.error = ['arraySource', 'time exceeded'];
        }
      }, 20000)
    }
  }

  ngOnInit() {
    
  }

  filterArrayKey(data){
    let filter = data.map((data) => {
      let temp = [];
      temp.push(data);
      return temp;
    })

    console.log(filter);

    this.arraySourceFinal = filter; 
  }
}
