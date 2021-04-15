import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DBMangerPage } from './dbmanger.page';

describe('DBMangerPage', () => {
  let component: DBMangerPage;
  let fixture: ComponentFixture<DBMangerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DBMangerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DBMangerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
