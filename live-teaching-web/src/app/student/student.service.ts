import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AngularFireFunctions } from '@angular/fire/functions';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private fns: AngularFireFunctions
  ) {}

  listLiveSession() {
    return (
      this.db
        .collection('live_session')
        // .collection("live_session", ref => {
        //   return ref.where("endStamp", ">", new Date())
        // }))
        // .collection("live_session", ref => ref.where("endStamp", ">", new Date()))
        .snapshotChanges()
        .pipe(
          map(actions => {
            return actions.map(a => {
              const data: any = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })
        )
    );
  }

  snapshotLiveSessionWithRef(ref) {
    return this.db.doc(ref).valueChanges();
  }

  snapshotLiveSession(id) {
    return this.db
      .collection('live_session')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((action: any) => {
          const data: any = action.payload.data();
          const id = action.payload.id;
          return { id, ...data };
        })
      );
  }

  getRecordedSession(id) {
    return this.db
      .collection('recorded_session')
      .doc(id)
      .get()
      .pipe(
        map(documentRef => {
          const data = documentRef.data();
          return { id: documentRef.id, ...data };
        })
      );
  }

  listQuestionWithRef(sessionRef) {
    return this.db.doc(sessionRef).valueChanges();
  }

  joinLiveSession(liveSessionId, code) {
    const callable = this.fns.httpsCallable('joinLiveSession');
    return callable({
      live_session_id: liveSessionId,
      code
    });
  }

  submitAnswer(data) {
    const callable = this.fns.httpsCallable('submitAnswer');
    return callable(data);
  }
}
