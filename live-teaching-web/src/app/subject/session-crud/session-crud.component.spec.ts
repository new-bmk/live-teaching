import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCrudComponent } from './session-crud.component';

describe('SessionCrudComponent', () => {
  let component: SessionCrudComponent;
  let fixture: ComponentFixture<SessionCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
