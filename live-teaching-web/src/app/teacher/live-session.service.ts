import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import _ from 'lodash';
import { map } from 'rxjs/operators';
import { ILiveSession, IRecordedSession, ISession } from 'src/core/types';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiveSessionService {
  constructor(private fireStore: AngularFirestore, private http: HttpClient) {}

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
    return this.http
      .post(`${environment.serverUrl}/endLiveSession`, {
        data: { live_session_id: liveSessonRef }
      })
      .toPromise();
  }
}
