import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ILiveSession, IRecordedSession, ISession } from 'src/core/types';
import { LiveSessionService } from '../live-session.service';

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
    private liveSessionService: LiveSessionService
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

  createLiveSessionTableRaw(
    recordSession: IRecordedSession,
    session: ISession
  ) {
    const headers = [{ field: 'code', header: 'Code' }];
    const bodies = [];
    const totalScore = {};
    for (const participant of recordSession.participants) {
      const student = { code: participant.code };
      for (const [i, question] of session.questions.entries()) {
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
        totalScore[`q${i}`].resultScore += quiz.score;
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

  markAliveQuestion() {
    window.setTimeout(() => {
      this.liveSessionService.sendQuestion(this.liveSessionId, -1);
    }, this.aliveQuestionTime);
  }
}
