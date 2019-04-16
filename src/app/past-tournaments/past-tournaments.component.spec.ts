import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastTournamentsComponent } from './past-tournaments.component';

describe('PastTournamentsComponent', () => {
  let component: PastTournamentsComponent;
  let fixture: ComponentFixture<PastTournamentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastTournamentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
