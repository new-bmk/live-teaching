import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-quiz-answer-entry-input',
  templateUrl: './quiz-answer-entry-input.component.html',
  styleUrls: ['./quiz-answer-entry-input.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class QuizAnswerEntryInputComponent implements OnInit {
  @Input() set quetionObject(data) {
    if (data) {
      this.question = data;
    }
  }
  @Input() loadingQuestion = false;
  formControlName;
  @Input()
  set inputFormGroupName(value: string) {
    this.formControlName = value;
  }

  question;

  constructor(private parentF: FormGroupDirective) {}

  ngOnInit() {}
}
