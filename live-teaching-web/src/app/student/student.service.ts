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

  getLiveSession(id) {
    return this.db
      .collection("live_session")
      .doc(id)
      .valueChanges();
  }

  listQuestion(sessionRef) {
    return this.db.doc(sessionRef).valueChanges();
  }

  joinLiveSession(sessionRef) {}

  sendResult() {}

  getSubject(id) {
    console.log("id :", id);
    return this.db
      .collection("subject")
      .doc(id)
      .get();
  }
}
