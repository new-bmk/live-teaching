import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLiveComponent } from './student-live.component';

describe('StudentLiveComponent', () => {
  let component: StudentLiveComponent;
  let fixture: ComponentFixture<StudentLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
