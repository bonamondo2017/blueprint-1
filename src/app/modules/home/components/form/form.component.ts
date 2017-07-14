import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogClose } from '@angular/material';

/*Components*/
import { DeleteConfirmComponent } from './../../../../shared/components/delete-confirm/delete-confirm.component';
import { FormMultipleAutocompleteComponent } from './../../../../shared/components/form-multiple-autocomplete/form-multiple-autocomplete.component';

/*Models*/
import { SomethingsChild } from './../../../../shared/models/somethings-child';

/*Services*/
import { CrudService } from './../../../../shared/services/crud.service';

/* Validators */
import { MyValidators } from './../../../../shared/validators/my-validators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  arraySource: any;
  child = ['somethingsChild'];
  public crudParams: any;
  isLoading = true;
  msg;
  somethingsChild: any;
  somethingChild: any;
  somethingChildObject: SomethingsChild;
  somethingChildForm: FormGroup;
  thingsToSelect: any;
  thingsRelated: any;
  argToSearchPipe: any;
  searchList = false;
  searchAnswers;

  /* formMultipleAutocompleteComponent Input start */
  class;
  /* formMultipleAutocompleteComponent Input finish */

  constructor(
    private crud: CrudService, 
    public dialog: MdDialog,
    private myValidators: MyValidators
  ) {
    
    /* formMultipleAutocompleteComponent Input start */
    //Laravel
    this.crudParams = {
      route: 'users',
      show: ['name', 'id']
    }
    /*
    //Firebase
    this.crudParams = {
      source: 'firebase', 
      child: 'people', 
      show:['name']
    };
    */

    //Array
    this.crud.readArray('laravel', this.crudParams)
    .then(res => {
      this.arraySource = {
        source: 'array', 
        array: res
      }
    })

    this.class = "w100p";
    /* formMultipleAutocompleteComponent Input end */

    this.somethingChildForm = new FormGroup({
      'field_0_simpleInput': new FormControl('', [Validators.required, Validators.minLength(10)]),
      'field_0_simpleSelect': new FormControl('', Validators.required),
      'field_0_fileUpload': new FormControl(''),
      'field_0_multipleChoicesAutocomplete': new FormControl('')
    });
    
    this.thingsRelated = [];
  }

  ngOnInit() {
    this.readSomethingsChild();
  }
  
  create = () => {
    this.somethingChildObject = this.somethingChildForm.value;
    /*if(this.somethingChildForm.valid){ // Verifica se o FormGroup é válido
      this.crud.create('firebase', {child: this.child, objectToPush: this.somethingChildObject}); // cadastra o product Class no banco
      this.somethingChild = undefined;
      this.readSomethingsChild(); // Traz os producs Classs cadastrado no banco incluindo o que acabou de ser criado
      this.somethingChildForm.reset(); // Apaga as informações no form
    }*/
  }
  
  delete = (value) => {
    let dialogRef = this.dialog.open(
      DeleteConfirmComponent, 
      {
        data:
        {
          child: this.child, //somethingChild
          idChildToDelete: value, //__key
          childRelated: ['childRelated_0_productsGroup']
        }
      }
    );
    
    dialogRef.afterClosed().subscribe(() => {
      this.readSomethingsChild();
    });
  }

  onSubmit = () => {
    if(this.somethingChild) {
      this.update();
    } else {
      this.create();
    }
  }

  readSomethingsChild = () => {
    this.crud.readArray('laravel', this.crudParams)
    .then(res => {
      if(res['cod'] == "ra-03") {
        this.msg = res['message'];
        this.isLoading = false;
      } else {
        this.msg = undefined;
        this.somethingsChild = res['obj'];
        this.isLoading = false;
      }
    })
    .catch(rej => {
      this.msg = rej;
    })
  }

  readSomethingChild = (value) => {
    this.crud.readObject('firebase', {
      child: 'somethingsChild',
      orderByChild: 'simpleInput',
      equalTo: value
    })
    .then(res => {
      this.somethingChild = res;
    })
    .catch(rej => {
      this.msg = rej;
    })
  }

  update = () => {
    this.somethingChildObject = this.somethingChildForm.value;
    
    if(this.somethingChildForm.valid){ // Verifica se o FormGroup é válido
      this.crud.update('firebase', { child: this.child, idChildToUpdate: [this.somethingChild.__key], objectToUpdate: this.somethingChildObject}); // atualiza o product Class no banco
      this.somethingChild = undefined;
      this.readSomethingsChild(); // Traz os producs Classs cadastrado no banco incluindo o que acabou de ser atualizado
      this.somethingChildForm.reset(); // Apaga as informações no form
    }
  }

  /* Multiple Choices Autocomplete (begin) */
  search = (search, field) => {
    this.argToSearchPipe = field + "_" + search;
    if(search.length > 0) {
      this.searchList = true;
      this.searchAnswers = this.thingsToSelect;
    } else {
      this.searchList = false;
      this.searchAnswers = null;
    }
  }
  addSomeThing = (searchAnswer) => {
    this.thingsRelated.push(searchAnswer);
    this.somethingChildForm.controls['field_0_multipleChoicesAutocomplete'].setValue(this.thingsRelated);
    this.searchList = false;
    this.searchAnswers = null;
  }
  deleteSomeThing = (thingToDeleteId) => {
    let index;
    for(let i=0; i<this.thingsRelated.length; i++){
      if(thingToDeleteId == this.thingsRelated[i].id){
        index = i;
        break;
      }
    }
    this.thingsRelated.splice(index, 1);
    this.somethingChildForm.controls['field_0_multipleChoicesAutocomplete'].setValue(this.thingsRelated);
  }
  /* Multiple Choices Autocomplete (end) */

}
