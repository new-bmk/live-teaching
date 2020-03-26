import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ILiveSession, IRecordedSession, ISession } from 'src/core/types';
import { LiveSessionService } from '../live-session.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-live-session',
  templateUrl: './live-session.component.html',
  styleUrls: ['./live-session.component.scss']
})
export class LiveSessionComponent implements OnInit {
  aliveQuestionTime = 5000; // ms
  liveSession$?: Observable<ILiveSession>;
  liveSessionId?: string;
  liveSessionTableRaw$: Observable<any>;
  loading = true;
  session?: ISession;

  constructor(
    private route: ActivatedRoute,
    private liveSessionService: LiveSessionService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.liveSessionId = this.route.snapshot.paramMap.get('ref');
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
            this.loading = false;
            return this.createLiveSessionTableRaw(recordSession, this.session);
          }),
          catchError((error: Error) => {
            throw error;
          })
        );
    } catch (error) {
      console.error(error);
    }
  }

  back(){
    this.location.back()
  }

  createLiveSessionTableRaw(
    recordSession: IRecordedSession,
    session: ISession
  ) {
    console.log('session', session);
    const headers = [{ field: 'code', header: 'Code' }];
    const bodies = [];
    const totalScore = {};
    for (const participant of recordSession.participants) {
      const student = { code: participant.code };
      const questions = _.get(session, 'questions');
      if (questions) {
        for (const [i, question] of _.get(session, 'questions').entries()) {
          headers.push({ field: `q${i}`, header: `Q${i}` });

          const quiz = participant.quiz_results.find(q => q.question_idx === i);
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
      obj => (obj.resultScore / ((studentCount || 1) * obj.maxScore)) * 100
    );
    percentage.code = '%';

    return {
      headers,
      bodies: [percentage, ...bodies]
    };
  }

  async onSendQuestion(idx: number) {
    this.liveSessionService
      .sendQuestion(this.liveSessionId, idx)
      .then(() => this.markAliveQuestion())
      .catch(error => console.error(error));
  }

  endSession() {
    if (
      window.confirm(`Are you sure to end live session, you can't return back.`)
    ) {
      this.liveSessionService
        .endSession(this.liveSessionId)
        .then(() => {
          window.alert('end live session success..');
          this.router.navigate([`/subject`], { replaceUrl: true });
        })
        .catch(error => {
          window.alert(`Can't end live session. ${error.message}`);
        });
    }
  }

  markAliveQuestion() {
    window.setTimeout(() => {
      this.liveSessionService.sendQuestion(this.liveSessionId, -1);
    }, this.aliveQuestionTime);
  }
}
