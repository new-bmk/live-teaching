import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { auth } from 'firebase/app';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endUserDataSubject: BehaviorSubject<any>;

  token
  constructor(
    private fireStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.endUserDataSubject = new BehaviorSubject({});
  }

  setUser(auth, onSetUserSuccess?) {
    if (auth) {

      auth.getIdToken().then(token => {
        this.token = token
        // console.log(token)
      })
      this.getEndUserFromFireStore(auth.providerData[0].email).subscribe(endUsers => {
        if (onSetUserSuccess) {
          onSetUserSuccess(endUsers);
        }
        this.endUserDataSubject.next(_.head(endUsers));
      });
    }
  }

  get getEndUser() {
    return this.endUserDataSubject.asObservable();
  }

  getEndUserFromFireStore(email) {
    return this.fireStore
      .collection('user', ref => ref.where('email', '==', email))
      .get()
      .pipe(
        map(endUsers =>
          endUsers.docs.map((endUser: any) => {
            const id = endUser.id;
            const data = endUser.data();
            return { id, ...data };
          })
        ),
        tap(_ => console.log('fetched endUser')),
        catchError(this.handleError('getEndUser', []))
      );
  }

  loginWithFacebook() {
    return this.afAuth.auth
      .signInWithPopup(new auth.FacebookAuthProvider())
  }

  loginWithGoogle() {
    var provider = new auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.addScope('https://www.googleapis.com/auth/plus.me')
    this.afAuth.auth.signInWithPopup(provider).then(() => {})
  }

  register(userAuth, setUser?){
    let id = userAuth.providerData[0].email.split("@psu.ac.th")[0]
    this.fireStore
      .collection("user")
      .doc(userAuth.uid)
      .set({
        name: userAuth.providerData[0].email.split("@")[0],
          studentId: isNaN(+id)
            ? ""
            : id,
        email: userAuth.email,
        role: isNaN(+id) ? "teacher" : "student"
      })
      .then(() => {
        this.setUser(userAuth, endUser => {
          if (_.isEmpty(endUser)) {
            this.signOut();
          } else {
            setUser(endUser[0]);
            if (endUser[0].role === "teacher") {
              this.router.navigate(["/teacher"], { replaceUrl: true });
            } else {
              this.router.navigate(["/student"], { replaceUrl: true });
            }
          }
        });
      });
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }

  private log(message: string) {
    console.log(`Authentication: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
