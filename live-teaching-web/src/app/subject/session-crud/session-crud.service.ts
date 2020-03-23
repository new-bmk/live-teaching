import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SessionCrudService {
  constructor(private fireStore: AngularFirestore, private http: HttpClient) {}

  loadSession(subjectId: string) {
    return this.fireStore
      .collection("subject")
      .doc(subjectId)
      .collection("sessions")
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
      .collection("subject")
      .doc(subjectId)
      .collection("sessions")
      .add(data);
  }

  updateSession(subjectId: string, sessionId: string, data: any) {
    return this.fireStore
      .collection("subject")
      .doc(subjectId)
      .collection("sessions")
      .doc(sessionId)
      .update(data);
  }

  deleteSession(subjectId: string, sessionId: string) {
    return this.fireStore
      .collection("subject")
      .doc(subjectId)
      .collection("sessions")
      .doc(sessionId)
      .delete();
  }

  // ------- pre live-session
  createLiveSession(data) {
    return this.http
      .post(`${environment.serverUrl}/createLiveSession`, { data })
      .toPromise();
  }
}
