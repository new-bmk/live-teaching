import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class StudentService {
  constructor(private db: AngularFirestore) {}

  listLiveSession() {
    return (
      this.db
        .collection("live_session")
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

  getRecordedSession(id) {
    return this.db
      .collection("recorded_session")
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

  joinLiveSession(liveSessionId) {}

  sendResult() {}
}
