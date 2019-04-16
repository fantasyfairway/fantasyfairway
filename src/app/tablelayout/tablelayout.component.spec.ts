import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablelayoutComponent } from './tablelayout.component';

describe('TablelayoutComponent', () => {
  let component: TablelayoutComponent;
  let fixture: ComponentFixture<TablelayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablelayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablelayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
