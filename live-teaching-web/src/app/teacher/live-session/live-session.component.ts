import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ILiveSession, IRecordedSession, ISession } from 'src/core/types';
import { LiveSessionService } from '../live-session.service';
import { Location } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-live-session',
  templateUrl: './live-session.component.html',
  styleUrls: ['./live-session.component.scss'],
  providers: [ConfirmationService],
})
export class LiveSessionComponent implements OnInit {
  aliveQuestionTime = environment.aliveQuestionTime; // ms
  liveSession$?: Observable<ILiveSession>;
  liveSessionId?: string;
  liveSessionTableRaw$: Observable<any>;
  voiceTableHeaders: any[]
  recordedSessionId?: string;
  loading = true;
  session?: ISession;
  voiceClips: any[];

  constructor(
    private route: ActivatedRoute,
    private liveSessionService: LiveSessionService,
    private router: Router,
    private location: Location,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.liveSessionId = this.route.snapshot.paramMap.get('ref');
    this.voiceTableHeaders = [{ field: 'participantCode', header: 'Participant' }, { field: 'fileUrl', header: 'FileUrl' }, { field: 'sent_stamp', header: 'Time' }]
    try {
      this.liveSession$ = this.liveSessionService.subscribeLiveSessionById(
        this.liveSessionId
      );
      this.liveSessionTableRaw$ = this.liveSessionService
        .subscribeRecordedSession(this.liveSessionId)
        .pipe(
          map(async (recordSession: IRecordedSession) => {
            this.session = this.session
              ? this.session
              : await this.liveSessionService.getSessionByRef(
                  recordSession.session_ref
                );
            this.recordedSessionId = _.get(recordSession, 'id');
            this.voiceClips = recordSession.voiceClips;
            this.loading = false;
            return this.createLiveSessionTableRaw(recordSession, this.session);
          }),
          catchError((error: Error) => {
            throw error;
          })
        );
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Live Session',
        detail: error.message,
      });
    } finally {
      this.loading = false;
    }
  }

  back() {
    this.location.back();
  }

  createLiveSessionTableRaw(
    recordSession: IRecordedSession,
    session: ISession
  ) {
    const headers = [{ field: 'code', header: 'Code' }];
    const bodies = [];
    const totalScore = {};
    for (const participant of recordSession.participants) {
      const student = { code: participant.code };
      const questions = _.get(session, 'questions');
      if (questions) {
        for (const [i, question] of _.get(session, 'questions').entries()) {
          headers.push({ field: `q${i}`, header: `Q${i}` });

          const quiz = participant.quiz_results.find(
            (q) => q.question_idx === i
          );
          if (!quiz) {
            student[`q${i}`] = '-';
          } else {
            student[`q${i}`] = quiz.answer === question.answer ? '/' : 'x';
          }

          if (!totalScore[`q${i}`]) {
            totalScore[`q${i}`] = { resultScore: 0, maxScore: question.score };
          }
          totalScore[`q${i}`].resultScore += _.get(quiz, 'score') || 0;
        }
      }
      bodies.push(student);
    }

    const studentCount = _.size(bodies);
    const percentage = _.mapValues(
      totalScore,
      (obj) => (obj.resultScore / ((studentCount || 1) * obj.maxScore)) * 100
    );
    percentage.code = '%';

    return {
      headers,
      bodies: [percentage, ...bodies],
    };
  }

  onListenVoiceClip(idx: number) {
    this.liveSessionService.listening(this.recordedSessionId, idx);
  }

  async onSendQuestion(idx: number) {
    this.liveSessionService
      .sendQuestion(this.liveSessionId, idx)
      .then(() => {
        this.markAliveQuestion();
        this.messageService.add({
          severity: 'success',
          summary: 'Send Question',
          detail: `Question [${idx}] has been send`,
        });
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: `Can't send question.`,
          detail: `${error.message}`,
        });
      });
  }

  endSession() {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Are you sure to end live session, you can't return back.`,
      accept: () => {
        this.loading = true;
        this.liveSessionService
          .endSession(this.liveSessionId)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Live Session',
              detail: `Live Session has been end`,
            });
            this.router.navigate([`/subject`], { replaceUrl: true });
          })
          .catch((error) => {
            this.messageService.add({
              severity: 'error',
              summary: `Can't end live session.`,
              detail: ` ${error.message}`,
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
    });
  }

  markAliveQuestion() {
    window.setTimeout(() => {
      this.liveSessionService.sendQuestion(this.liveSessionId, -1);
    }, this.aliveQuestionTime);
  }
}
