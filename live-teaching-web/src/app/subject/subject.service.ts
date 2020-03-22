import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { PagedRestfulService } from '@app/core/paged-restful.service';

@Injectable({
  providedIn: "root"
})
export class SubjectService {
  constructor(
    private http: HttpClient,
  ) // private pagedRestfulService: PagedRestfulService
  {}

  loadSubject(id: string) {
    // return this.pagedRestfulService.loadPagedRestful( 'review', reviewId)
    return of(null);
  }

  listSubjectXXXXX(
    offset: number,
    max: number,
    filter?: any,
    sort?: string,
    order?: any
  ) {
    // return this.pagedRestfulService.listPagedRestful( 'review', offset, max, filter, sort, order)
    return of(null);
  }

  createSubject(data) {
    // return this.pagedRestfulService.createPagedRestful( 'review', data)
    return of(null);
  }

  updateSubject(id, data) {
    // return this.pagedRestfulService.updatePagedRestful( 'review', id, data)
    return of(null);
  }

  deleteSubject(id) {
    // return this.pagedRestfulService.deletePagedRestful( 'review', id)
    return of(null);
  }

  listSubjects(
    offset: number,
    max: number,
    filter?: any,
    sort?: string,
    order?: any
  ) {
    return of({
      results: [
        { id: "00001", name: 'Introduction to Programing', publicity: "public" },
        { id: "00002", name: 'Discrete mathematics ',publicity: "public" },
        { id: "00003", name: 'Software Lab', publicity: "public" }
      ],
      totalCount: 3
    });
  }

  // ------- pre live-session
  createLiveSession(data) {
    return this.http
      .post(`${environment.serverUrl}/createLiveSession`, { data })
      .toPromise();
  }
}
