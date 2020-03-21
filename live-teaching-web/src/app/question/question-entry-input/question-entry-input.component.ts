import { Component, OnInit } from "@angular/core";
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from "@angular/forms";
import * as _ from "lodash";
import { pairwise } from "rxjs/operators";
import { Question } from "../models/question";

@Component({
  selector: "app-question-entry-input",
  templateUrl: "./question-entry-input.component.html",
  styleUrls: ["./question-entry-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: QuestionEntryInputComponent,
      multi: true
    }
  ]
})
export class QuestionEntryInputComponent
  implements OnInit, ControlValueAccessor {
  formArray: FormArray = new FormArray([]);
  _onChange: any;
  initialQuestionValue: Question = {
    type: "simple_choices",
    question_text: null,
    question_image_url: null,
    c1: null,
    c2: null,
    c3: null,
    c4: null,
    answer: null,
    score: 0
  };

  // answerOptions: { (index: number) : { label: string; value: string }[] } = {};
  answerOptions: any = {};
  constructor() {}

  ngOnInit() {}

  writeValue(obj: any): void {
    this.clearFormArray(this.formArray);

    _.each(obj, (question: Question, index: number) => {
      this.addQuestion(question);
      this.answerOptions[index] = this.createAnswerOptions(question);
    });

    this.formArray.valueChanges.subscribe(val => {
      console.log(" val", val);
      this._onChange(val);

      _.each(val, (question: Question, index: number) => {
        this.answerOptions[index] = this.createAnswerOptions(question);
      });
    });
  }

  createQuestion(question: Question) {
    return new FormGroup({
      type: new FormControl(question.type, [Validators.required]),
      question_text: new FormControl(question.question_text, [
        Validators.required
      ]),
      question_image_url: new FormControl(question.question_image_url),
      c1: new FormControl(question.c1, [Validators.required]),
      c2: new FormControl(question.c2, [Validators.required]),
      c3: new FormControl(question.c3, [Validators.required]),
      c4: new FormControl(question.c4, [Validators.required]),
      answer: new FormControl(question.answer, [Validators.required]),
      score: new FormControl(question.score, [Validators.required])
    });
  }

  addQuestion(question: Question) {
    this.formArray.push(this.createQuestion(question));
  }

  removeQuestion(index: number) {
    this.formArray.removeAt(index);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  createAnswerOptions(question: Question) {
    const { c1, c2, c3, c4 } = question;
    return [
      { label: c1, value: c1 },
      { label: c2, value: c2 },
      { label: c3, value: c3 },
      { label: c4, value: c4 }
    ];
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };
}
