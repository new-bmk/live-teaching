import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import _ from 'lodash';
import { map } from 'rxjs/operators';
import { ILiveSession, IRecordedSession, ISession } from 'src/core/types';

@Injectable({
  providedIn: 'root'
})
export class LiveSessionService {
  constructor(
    private fireStore: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

  getSessionByRef(sessionRef: DocumentReference) {
    return sessionRef
      .get()
      .then(snapshot =>
        snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null
      ) as Promise<ISession>;
  }

  sendQuestion(liveSessionId: string, idx: number) {
    return this.fireStore
      .collection('live_session')
      .doc(liveSessionId)
      .update({ active_question_idx: idx });
  }

  subscribeLiveSessionById(id: string) {
    return this.fireStore
      .collection('live_session')
      .doc(id)
      .valueChanges()
      .pipe(
        map((result: ILiveSession) => {
          if (!result) {
            return {};
          } else {
            return {
              id,
              ...result
            };
          }
        })
      );
  }

  subscribeRecordedSession(liveSessionRef: string) {
    const liveSession = this.fireStore
      .collection('live_session')
      .doc(liveSessionRef).ref;
    return this.fireStore
      .collection<IRecordedSession>('recorded_session', (ref: any) =>
        ref.where('live_session_ref', '==', liveSession)
      )
      .valueChanges()
      .pipe(map(result => _.head(result)));
  }

  endSession(liveSessonRef) {
    const callable = this.fns.httpsCallable('endLiveSession');
    return callable({ live_session_id: liveSessonRef }).toPromise();
  }
}
