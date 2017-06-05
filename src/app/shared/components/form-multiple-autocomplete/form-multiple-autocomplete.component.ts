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
  fieldsToShow: any;

  constructor(
    private crud: CrudService
  ) {

  }

  ngOnInit() {
    if(this.arraySource) {
      switch(this.arraySource.source) {
        case 'firebase':
          if(this.arraySource.child) {
            if(this.arraySource.fieldsToShow) {
              this.crud.readArray({ child: this.arraySource.child })
              .then(res => {
                this.array = res;
                let test = document.createElement('div');
                test.setAttribute('class', 'test');
                
                for(let i = 0; i < this.arraySource.fieldsToShow.length; i++) {
                  test.innerHTML += "	&#123;&#123;element."+this.arraySource.fieldsToShow[i]+"&#125;&#125;"
                  
                  if(i < (this.arraySource.fieldsToShow.length - 1)) {
                    test.innerHTML += " - ";
                  }
                }
                console.log(test.innerText);
                this.fieldsToShow = test.innerText;
              });           
            
            } else {
              this.error = ['arraySource.fieldsToShow']  
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
}
