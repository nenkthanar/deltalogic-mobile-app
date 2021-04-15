import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoicecommandPage } from './voicecommand.page';

describe('VoicecommandPage', () => {
  let component: VoicecommandPage;
  let fixture: ComponentFixture<VoicecommandPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoicecommandPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoicecommandPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
