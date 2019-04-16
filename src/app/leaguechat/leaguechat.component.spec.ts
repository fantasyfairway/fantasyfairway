/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeaguechatComponent } from './leaguechat.component';

describe('LeaguechatComponent', () => {
  let component: LeaguechatComponent;
  let fixture: ComponentFixture<LeaguechatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaguechatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
