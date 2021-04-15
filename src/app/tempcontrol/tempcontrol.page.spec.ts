import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempcontrolPage } from './tempcontrol.page';

describe('TempcontrolPage', () => {
  let component: TempcontrolPage;
  let fixture: ComponentFixture<TempcontrolPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempcontrolPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempcontrolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
