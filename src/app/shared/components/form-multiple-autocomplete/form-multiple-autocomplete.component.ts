import { Component, Input, OnInit } from '@angular/core';

/*Serices*/
import { CrudService } from './../../services/crud.service';

@Component({
  selector: 'form-multiple-autocomplete',
  templateUrl: './form-multiple-autocomplete.component.html',
  styleUrls: ['./form-multiple-autocomplete.component.css']
})
export class FormMultipleAutocompleteComponent implements OnInit {
  @Input() arraySource: any;
  @Input() class: string;

  array: any = [];
  arraySourceFinal: any = [];
  error: any = [];

  constructor(
    private crud: CrudService
  ) {
    
  }

  ngOnInit() {
    if(this.arraySource) {
      switch(this.arraySource.source) {
        case 'firebase':
          if(this.arraySource.child) {
            if(this.arraySource.childKeys) {
              this.crud.readArray({ 
                child: this.arraySource.child,
                keys: this.arraySource.childKeys
              })
              .then(res => {
                this.array = res;
                this.filterArrayKey(this.array);
              });           
            
            } else {
              this.error = ['arraySource.childKeys']  
            }
          } else {
            this.error = ['arraySource.child']
          }
        break;

        case 'arrayInComponent':
        break;

        default:
          this.error = ['arraySource.source'] ;
      }
    } else {
      this.error = ['arraySource']
    }
  }

  filterArrayKey(data){
    let filter = data.map((data) => {
      let temp = [];
      for(let lim = this.arraySource.childKeys.length, i = 0; i < lim; i++){
        temp.push(data[this.arraySource.childKeys[i]]);
      }
      return temp;
    })

    this.arraySourceFinal = filter; 
  }
}
