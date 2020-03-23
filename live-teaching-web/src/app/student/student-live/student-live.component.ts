import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentService } from '../student.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { Subject } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-student-live',
  templateUrl: './student-live.component.html',
  styleUrls: ['./student-live.component.scss']
})
export class StudentLiveComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  quizList = [];

  quizForm = new FormGroup({
    anwser: new FormControl('', Validators.required)
  });

  activeQuizIndex = -1;
  loadingQuestion = false;
  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  liveSessionSubscribe;
  displayBasic = true;
  loading = true;
  srcUrl = '';
  subject;
  studentData;
  liveSessionData;
  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.authService.getEndUser
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((auth: any) => {
        this.studentData = auth;
      });
    this.snapshotLiveSession(id);
  }

  ngOnDestroy() {
    this.liveSessionSubscribe.unsubscribe();
  }

  back() {
    this.location.back();
  }

  get stramURL() {
    return this.srcUrl;
  }

  async snapshotLiveSession(liveSessionId) {
    this.liveSessionSubscribe = this.studentService
      .snapshotLiveSession(liveSessionId)
      .subscribe(async (data: any) => {
        this.activeQuizIndex = data.active_question_idx;
        if (_.isEmpty(this.quizList)) {
          this.getQuiz(data.session_ref);
        }
        await data.session_ref.parent.parent
          .get()
          .then((actionSubject: any) => {
            this.subject = actionSubject.data();
          });
        this.srcUrl = data.stream_url;
        this.liveSessionData = data;
        this.loading = false;
      });
  }

  getQuiz(session_ref) {
    this.studentService
      .listQuestionWithRef(session_ref)
      .pipe(
        filter((quiz: any) => {
          return true;
        })
      )
      .subscribe((data: any) => {
        this.quizList = data.questions;
      });
  }

  submitQuestion() {
    this.loadingQuestion = true
    if (this.quizForm.invalid) {
      return;
    }
    this.studentService
      .submitAnswer({
        live_session_id: this.liveSessionData.id,
        code: this.studentData.studentId,
        quesionAnswer: this.quizForm.value.anwser,
        questionIdx: this.activeQuizIndex
      })
      .subscribe((result: any) => {
        if (result.valid) {
          this.messageService.add({
            severity: 'success',
            summary: 'ส่งคำตอบสำเร็จ'
          });
          this.loading = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'ส่งคำตอบไม่สำเร็จ',
            detail: `เนื่องจาก ${result.reason}`
          });
        }
        this.loadingQuestion = false
        this.displayBasic = false;
        this.clearQuizForm();
      });
  }

  clearQuizForm() {
    this.quizForm.reset();
  }

  isLessThanTen() {
    return true;
  }
}
