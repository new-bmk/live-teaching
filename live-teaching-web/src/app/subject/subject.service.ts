import { Injectable } from "@angular/core";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SubjectService {
  constructor() {}

  listSubjects(
    offset: number,
    max: number,
    filter?: any,
    sort?: string,
    order?: any
  ) {
    return of({ results: [{}, {}, {}], totalCount: 3 });
  }
}
