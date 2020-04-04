import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import * as _ from 'lodash';
import { Question } from '../models/question';

@Component({
  selector: 'app-question-entry-input',
  templateUrl: './question-entry-input.component.html',
  styleUrls: ['./question-entry-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuestionEntryInputComponent),
      multi: true
    }
  ]
})
export class QuestionEntryInputComponent
  implements OnInit, ControlValueAccessor {
  questions: FormArray;
  _onChange: any = () => {};
  initialQuestionValue: Question = {
    type: 'simple_choices',
    question_text: null,
    question_image_url: null,
    c1: null,
    c2: null,
    c3: null,
    c4: null,
    answer: null,
    score: 0
  };

  answerOptions: { label: string; value: string }[] = [
    { label: 'c1', value: 'c1' },
    { label: 'c2', value: 'c2' },
    { label: 'c3', value: 'c3' },
    { label: 'c4', value: 'c4' }
  ];
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  writeValue(obj: any): void {
    this.questions = new FormArray([]);
    _.each(obj, (question: Question, index: number) => {
      this.addQuestion(question);
    });

    this.questions.valueChanges.pipe().subscribe(val => {
      this._onChange(val);
    });
  }

  createQuestion(question: Question) {
    return this.fb.group({
      type: [question.type, [Validators.required]],
      question_text: [question.question_text, [Validators.required]],
      question_image_url: [question.question_image_url],
      c1: [question.c1, [Validators.required]],
      c2: [question.c2, [Validators.required]],
      c3: [question.c3, [Validators.required]],
      c4: [question.c4, [Validators.required]],
      answer: [question.answer, [Validators.required]],
      score: [question.score, [Validators.required]]
    });
  }

  addQuestion(question: Question) {
    this.questions.push(this.createQuestion(question));
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
