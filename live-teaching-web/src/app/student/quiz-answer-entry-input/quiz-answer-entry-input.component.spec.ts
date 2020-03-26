import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAnswerEntryInputComponent } from './quiz-answer-entry-input.component';

describe('QuizAnswerEntryInputComponent', () => {
  let component: QuizAnswerEntryInputComponent;
  let fixture: ComponentFixture<QuizAnswerEntryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizAnswerEntryInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizAnswerEntryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
