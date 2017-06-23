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
  arraySource: any = [];
  arraySourceFinal: any = [];
  arraySourceSearch: any = [];
  checkAllController: boolean = false;
  checkedItem: boolean = false;
  error: any = [];
  isLoadingList: boolean = true;
  msg: string;
  rows: any = [];
  pages: any = [];
  searchForm: FormGroup;
  searchInput: boolean = false;
  selectedPageValue: number;
  selectedRowValue: number;
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
            if(this.list.childKeys) {
              this.crud.readArray('firebase', { 
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
    
    let filter = data.map((data) => {
      let temp = [];
      for(let lim = this.list.childKeys.length, i = 0; i < lim; i++){
        temp.push(data[this.list.childKeys[i]]);
      }
      
      return temp;
    })

    this.arraySourceFinal = filter; 
    this.arraySourceSearch = filter; 
    console.log(this.arraySourceSearch);
  }

  search = () => {
    let checkLoop = -1;
    let count;
    let data = this.arraySourceFinal;
    let dataString;
    let search;
    let temp = [];
    let test;

    if(this.searchForm.controls.search.value) {
      search = this.searchForm.controls.search.value;
    } else {
      search = "";
    }
    
    for(let lim = data.length, i = 0; i < lim; i ++) {
      for(let limj = (data[i].length), j = 0; j < limj; j++) {
        dataString = data[i][j].toLowerCase();
        count = dataString.search(search.toLowerCase());
        
        if(count !== -1) {
          if(checkLoop != i) {
            temp.push(data[i]);
          }

          checkLoop = i;
        }
      }
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