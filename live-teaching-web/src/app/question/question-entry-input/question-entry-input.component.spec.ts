import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionEntryInputComponent } from './question-entry-input.component';

describe('QuestionEntryInputComponent', () => {
  let component: QuestionEntryInputComponent;
  let fixture: ComponentFixture<QuestionEntryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionEntryInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionEntryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
