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
            if(this.arraySource.keys) {
              this.crud.readArray({ 
                child: this.arraySource.child,
                keys: this.arraySource.keys
              })
              .then(res => {
                this.array = res;
              });           
            
            } else {
              this.error = ['arraySource.keys']  
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

  generateArray = (obj) => {
    return Object.keys(obj)
    .map((key)=>{
      return obj[key];
    });
  }
}
