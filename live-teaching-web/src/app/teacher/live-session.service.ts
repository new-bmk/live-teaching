import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import _ from 'lodash';
import { map } from 'rxjs/operators';
import { ILiveSession, IRecordedSession, ISession } from 'src/core/types';

@Injectable({
  providedIn: 'root',
})
export class LiveSessionService {
  constructor(
    private fireStore: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

  getSessionByRef(sessionRef: DocumentReference) {
    return sessionRef
      .get()
      .then((snapshot) =>
        snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null
      ) as Promise<ISession>;
  }

  sendQuestion(liveSessionId: string, idx: number) {
    return this.fireStore
      .collection('live_session')
      .doc(liveSessionId)
      .update({ active_question_idx: idx });
  }

  listening(recordedSessionId: string, voiceClipIdx: number) {
    const selectRecordedSession = this.fireStore
      .collection<IRecordedSession>('recorded_session')
      .doc(recordedSessionId).ref;

    return this.fireStore.firestore.runTransaction((transaction) => {
      return transaction.get(selectRecordedSession).then((results) => {
        if (!results.exists) {
          throw new Error('Document does not exist!');
        }
        const result = results.data();
        const voiceClips = result.voiceClips;
        voiceClips[voiceClipIdx] = {
          ...voiceClips[voiceClipIdx],
          listened: true,
        };
        transaction.update(selectRecordedSession, { voiceClips });
      });
    });
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
              ...result,
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
      .snapshotChanges()
      .pipe(
        map((results) => {
          if (results.length > 0) {
            const result = results[0];
            return {
              id: result.payload.doc.id,
              ...result.payload.doc.data(),
            };
          } else {
            return {};
          }
        })
      );
  }

  endSession(liveSessonRef) {
    const callable = this.fns.httpsCallable('endLiveSession');
    return callable({ live_session_id: liveSessonRef }).toPromise();
  }
}
