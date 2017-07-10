import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  arrayNoFilter: any = [];
  arraySource: any = [];
  arraySourceFinal: any = [];
  arraySourceSearch: any = [];
  backgroundColor: string;
  backgroundColorIndex: number;
  checkAllController: boolean = false;
  checkedItem: boolean = false;
  color: string;
  colorIndex: number;
  editRoute: string;
  error: any = [];
  isLoadingList: boolean = true;
  msg: string;
  rows: any = [];
  pages: any = [];
  searchForm: FormGroup;
  searchInput: boolean = false;
  selectedPageValue: number;
  selectedRowValue: number;
  colorByData: any;
  testingThisShit: any;
  
  constructor(
    private crud: CrudService
  ) {
    this.selectedPageValue = 1;
    this.selectedRowValue = 1;
    this.rows = [1, 5, 10, 15, 20, 50, 100, 150, 200];

    this.searchForm = new FormGroup({
      'search': new FormControl(null)
    })
  }

  ngOnChanges() {
    if(this.list) {
      switch(this.list.source) {
        case 'firebase':
          if(this.list.child) {
            if(this.list.show) {
              this.crud.readArray('firebase', { 
                child: this.list.child,
                show: this.list.show
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
              this.error = ['list.show']  
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
            
            /*if(this.list.colorByData) {
              this.colorByData = this.list.colorByData.map((data) => {
                let temp = [];
                
                temp = data;
                
                return temp;
              })

              console.log(this.colorByData)
              for(let lim = this.list.colorByData.length, i =0; i < lim; i++) {
                console.log(this.list.colorByData[i]);
              }
            }*/

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

  checkAllToggle() {
    this.checkAllController = !this.checkAllController;
  }

  checkItem = (e) => {
    if(e.checked){
      this.checkedItem = true;
      console.log(this.checkedItem);
    } else {
      this.checkedItem = false;
    }
  }
  
  filterArrayKey = (data) => {
    //Set pages array - find a better place for it beginning
    for(let lim = Math.ceil(data.length / this.selectedRowValue), i = 0; i < lim; i++) {
      this.pages[i] = i+1;
    }
    //Set pages array - find a better place for it ending
    
    //Everything from array, ignoring property show from list object
    let noFilter = data.map((data) => {
      let backgroundColor;
      let color;
      let field;
      let fieldValue;
      let temp = [];
      
      for(let lim = Object.keys(data).length, i = 0; i < lim; i++) {
        field = Object.keys(data)[i];

        for(let lim = this.list.colorByData.length, j =0; j < lim; j++) {          
          if(field == this.list.colorByData[j]['field']) {
            fieldValue = Object.keys(data)[i];
            backgroundColor = this.list.colorByData[j]['backgroundColor'];
            color = this.list.colorByData[j]['color'];
            
            if(this.list.colorByData[j]['fieldValue'] == data[fieldValue]) {
              temp.push(data['backgroundColor'] = backgroundColor);
              temp.push(data['color'] = color);
            } else {
              temp.push(data['backgroundColor'] = "#fff");
              temp.push(data['color'] = "#000");
            }

            if(this.list.edit) {
              console.log(174)
            }

            /**
             * {{list.edit.route}}/{{}}
             */
          }
        }
        temp.push(data[field]);
      }
      
      return temp;
    })

    //Filtered by property show in list object
    let filter = data.map((data) => {
      console.log(data)
      let backgroundColor;
      let color;
      let field;
      let fieldValue;
      let temp = [];
      
      for(let lim = this.list.show.length, i = 0; i < lim; i++){
        temp.push(data[this.list.show[i]]);
        temp.push(data.color);
        temp.push(data.backgroundColor);
      }
      
      return temp;
    })
    
    this.backgroundColorIndex = (filter.length);
    this.colorIndex = (filter.length - 1);
    this.arrayNoFilter = noFilter;
    this.arraySourceFinal = filter; 
    this.arraySourceSearch = filter;
  }

  search = () => {
    let checkLoop = -1;
    let count;
    let data = this.arraySourceFinal;
    let dataAny;
    let dataString;
    let search;
    let temp = [];
    let test;

    if(this.searchForm.controls.search.value) {
      search = this.searchForm.controls.search.value;
    } else {
      search = "";
    }
    switch(this.list.source) {
      case 'firebase':
        for(let lim = data.length, i = 0; i < lim; i ++) {
          for(let limj = (data[i].length), j = 0; j < limj; j++) {
            dataAny = data[i][j].toString();
            dataString = dataAny.toLowerCase();
            console.log(dataString);
            count = dataString.search(search.toLowerCase());
            
            if(count !== -1) {
              if(checkLoop != i) {
                temp.push(data[i]);
              }

              checkLoop = i;
            }
          }
        }
      break;

      case 'laravel':
        let searchParams = { route: 'users', }
        //this.crud.readArray('laravel', )
      break;

      default:
        this.error = ['list.source'] ;
    }

    this.arraySourceSearch = temp;   
  }

  searchInputToggle = () => {
    this.searchInput = !this.searchInput;
    this.searchForm.reset();

    if(!this.searchInput) {
      this.search();
    }
  }
}

/***************************************************************************************************************************************
 * Motivos para a lógica de acesso aos dados para a array da listagem NÃO SER aplicada dentro do componente                            *
 ***************************************************************************************************************************************/
/*
  Universaliza e individualiza a utilização do componente, já que nenhum terceiro elemento está diretamente relacionado a ele
  O argumento anterior é o que, no fim das contas, define o que componetizar, a independência do elemento
*/

/***************************************************************************************************************************************
 * Motivos para a lógica de acesso aos dados para a array da listagem SER aplicada dentro do componente                                *
 ***************************************************************************************************************************************/
/*
  Diminui a complexidade do uso do componente, já que um terceiro elemento, como service necessário para gerar array faz-se desnecessário
  A não necessidade de acessar um terceiro serviço no componente pai para gerar a array aumenta a produção
*/