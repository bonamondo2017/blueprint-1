import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'form-multiple-autocomplete',
  templateUrl: './form-multiple-autocomplete.component.html',
  styleUrls: ['./form-multiple-autocomplete.component.css']
})
export class FormMultipleAutocompleteComponent implements OnInit {
  @Input() class;

  error: boolean = false;

  constructor() { }

  ngOnInit() {
  }
}
