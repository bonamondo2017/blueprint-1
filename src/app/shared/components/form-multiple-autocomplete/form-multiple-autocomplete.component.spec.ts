import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMultipleAutocompleteComponent } from './form-multiple-autocomplete.component';

describe('FormMultipleAutocompleteComponent', () => {
  let component: FormMultipleAutocompleteComponent;
  let fixture: ComponentFixture<FormMultipleAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMultipleAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMultipleAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
