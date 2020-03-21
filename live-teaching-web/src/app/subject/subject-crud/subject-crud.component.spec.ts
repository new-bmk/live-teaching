import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCrudComponent } from './subject-crud.component';

describe('SubjectCrudComponent', () => {
  let component: SubjectCrudComponent;
  let fixture: ComponentFixture<SubjectCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
