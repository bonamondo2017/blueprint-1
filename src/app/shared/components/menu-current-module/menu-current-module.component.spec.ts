import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCurrentModuleComponent } from './menu-current-module.component';

describe('MenuCurrentModuleComponent', () => {
  let component: MenuCurrentModuleComponent;
  let fixture: ComponentFixture<MenuCurrentModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCurrentModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCurrentModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
