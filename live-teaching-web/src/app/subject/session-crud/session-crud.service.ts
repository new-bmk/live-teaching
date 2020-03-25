import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionCrudService {
  constructor(private fireStore: AngularFirestore, private http: HttpClient) {}

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
    return this.http
      .post(`${environment.serverUrl}/createLiveSession`, { data })
      .toPromise();
  }
}
