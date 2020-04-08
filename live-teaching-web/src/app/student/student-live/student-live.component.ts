import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { filter, finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { AudioRecordService } from 'src/app/shared-services/audio-record.service';
import { StudentService, IVoiceClip } from '../student.service';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-student-live',
  templateUrl: './student-live.component.html',
  styleUrls: ['./student-live.component.scss'],
})
export class StudentLiveComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  quizList = [];

  quizForm = new FormGroup({
    anwser: new FormControl('', Validators.required),
  });

  activeQuizIndex = -1;
  loadingQuestion = false;
  isPushToTalk = false;

  count = 30;
  countInterval;
  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private messageService: MessageService,
    private audioRecordService: AudioRecordService
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
        this.displayBasic = true;
        if (_.isEmpty(this.quizList)) {
          this.getQuiz(data.session_ref);
        }
        await data.session_ref.parent.parent
          .get()
          .then((actionSubject: any) => {
            this.subject = actionSubject.data();
          });
        if (data.stream_url.includes('?')) {
          this.srcUrl = data.stream_url + `&modestbranding=1&autoplay=1`;
        } else {
          this.srcUrl = data.stream_url + `?modestbranding=1&autoplay=1`;
        }
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
    this.loadingQuestion = true;
    if (this.quizForm.invalid) {
      return;
    }
    this.studentService
      .submitAnswer({
        live_session_id: this.liveSessionData.id,
        code: this.studentData.studentId,
        quesionAnswer: this.quizForm.value.anwser,
        questionIdx: this.activeQuizIndex,
      })
      .subscribe((result: any) => {
        if (result.valid) {
          this.messageService.add({
            severity: 'success',
            summary: 'ส่งคำตอบสำเร็จ',
          });
          this.loading = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'ส่งคำตอบไม่สำเร็จ',
            detail: `เนื่องจาก ${result.reason}`,
          });
        }
        this.loadingQuestion = false;
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

  startPushToTalk() {
    this.isPushToTalk = true;
    this.audioRecordService.startRecording();
    this.countDownPushToTalk();
  }

  countDownPushToTalk() {
    setTimeout(() => {
      if (this.isPushToTalk) {
        this.stopPushToTalk();
      }
    }, 30000);
    this.count = 30;
    this.countInterval = setInterval(() => {
      this.count--;
      if (this.count == 0) {
        clearInterval(this.countInterval);
      }
    }, 1000);
  }

  stopPushToTalk() {
    this.isPushToTalk = false;
    this.audioRecordService.stopRecording();
    this.audioRecordService.getRecordedBlob().subscribe((blob) => {
      this.studentService
        .uploadFile(blob.blob, this.subject.title, this.studentData.name)
        .subscribe(async (data: any) => {
          const url = await data;
          this.createClipVoice({
            live_session_id: this.liveSessionData.id,
            code: this.studentData.studentId,
            file_URL: url,
          });
        });
    });
  }

  private createClipVoice(voiceClipObject: IVoiceClip) {
    this.studentService
      .createVoiceClip(voiceClipObject)
      .subscribe((data: any) => {
        if (data.valid) {
          this.messageService.add({
            severity: 'success',
            summary: 'ส่งคำถามสำเร็จ',
          });
          this.loading = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'บันทึกไม่สำเร็จ',
            detail: `เนื่องจาก ${data.reason}`,
          });
        }
      });
  }
}
