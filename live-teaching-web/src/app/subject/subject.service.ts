import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import _ from 'lodash';
// import { PagedRestfulService } from '@app/core/paged-restful.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  constructor(private fireStore: AngularFirestore) {}

  private subjectTranform(doc) {
    return {
      ...doc.data(),
      id: doc.id
    };
  }

  loadSubject(id: string) {
    this.fireStore
      .collection('subject')
      .doc(id)
      .get()
      .pipe(
        map(doc => {
          if (doc.exists) {
            return this.subjectTranform(doc);
          } else {
            return null;
          }
        })
      );
  }

  createSubject(data) {
    return this.fireStore.collection('subject').add(data);
  }

  updateSubject(id, data) {
    return this.fireStore
      .collection('subject')
      .doc(id)
      .update(data);
  }

  deleteSubject(id) {
    return this.fireStore
      .collection('subject')
      .doc(id)
      .delete();
  }

  listSubjects(
    offset: number,
    max: number,
    filter?: any,
    sort?: string,
    order?: any
  ) {
    return this.fireStore
      .collection('subject', ref => {
        let query:
          | firebase.firestore.CollectionReference
          | firebase.firestore.Query = ref;
        if (_.get(filter, 'email')) {
          ref.where('moderators', 'array-contains', filter.email);
        }
        return query;
      })
      .get()
      .pipe(
        map(result => {
          if (result.empty) {
            return [];
          } else {
            return result.docs.map(this.subjectTranform);
          }
        })
      );
  }
}
