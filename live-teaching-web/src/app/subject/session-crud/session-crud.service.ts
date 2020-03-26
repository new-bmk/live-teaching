import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionCrudService {
  constructor(
    private fireStore: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

  loadSession(subjectId: string) {
    return this.fireStore
      .collection('subject')
      .doc(subjectId)
      .collection('sessions')
      .snapshotChanges()
      .pipe(
        map(results => {
          return results.map(result => ({
            id: result.payload.doc.id,
            ...result.payload.doc.data()
          }));
        })
      );
  }

  createSession(subjectId: string, data: any) {
    return this.fireStore
      .collection('subject')
      .doc(subjectId)
      .collection('sessions')
      .add(data);
  }

  updateSession(subjectId: string, sessionId: string, data: any) {
    return this.fireStore
      .collection('subject')
      .doc(subjectId)
      .collection('sessions')
      .doc(sessionId)
      .update(data);
  }

  deleteSession(subjectId: string, sessionId: string) {
    return this.fireStore
      .collection('subject')
      .doc(subjectId)
      .collection('sessions')
      .doc(sessionId)
      .delete();
  }

  createSessionRefById(subjectId: string, sessionId: string) {
    return this.fireStore
      .collection('subject')
      .doc(subjectId)
      .collection('sessions')
      .doc(sessionId).ref;
  }

  getLiveSessionId(subjectId: string, sessionId: string) {
    const sessionRef = this.createSessionRefById(subjectId, sessionId);
    return this.fireStore
      .collection('live_session', ref =>
        ref.where('session_ref', '==', sessionRef)
      )
      .get()
      .pipe(
        map(result => {
          return !result.empty ? result.docs[0].id : null;
        })
      );
  }

  // ------- pre live-session
  createLiveSession(data) {
    const callable = this.fns.httpsCallable('createLiveSession');
    return callable(data).toPromise();
  }
}
