import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectManageComponent } from './subject-manage.component';

describe('SubjectManageComponent', () => {
  let component: SubjectManageComponent;
  let fixture: ComponentFixture<SubjectManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
