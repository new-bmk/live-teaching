import { Component, OnInit, OnDestroy } from "@angular/core";
import { StudentService } from "./student.service";
import { FormGroup, FormControl } from "@angular/forms";
import { debounce, map, mergeMap } from "rxjs/operators";
import { interval, forkJoin } from "rxjs";
import * as _ from "lodash";
import { async } from "@angular/core/testing";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.scss"]
})
export class StudentComponent implements OnInit, OnDestroy {
  sessionList;
  originalSessionList;
  loading = true;
  totalRecords;
  row = 20;
  sessionSubscribe;
  cols;
  searchForm = new FormGroup({
    searchText: new FormControl("")
  });
  searchSubscribe;
  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.cols = [
      {
        field: "id",
        header: "Id"
      }
    ];
    this.listLiveSessionWithSubject();
    const formControl = this.searchForm.controls["searchText"];

    this.searchSubscribe = formControl.valueChanges
      .pipe(debounce(() => interval(1000)))
      .subscribe((value: string) => {
        // TODO for search subject title
        this.filterSubject(value);
      });
  }
  ngOnDestroy() {
    this.sessionSubscribe.unsubscribe();
    this.searchSubscribe.unsubscribe();
  }

  filterSubject(value) {
    const newSession = _.cloneDeep(this.originalSessionList);
    this.sessionList = _.filter(newSession, (session: any) => {
      return _.startsWith(
        _.lowerCase(session.subject.title),
        _.lowerCase(value)
      );
    });
  }

  listLiveSessionWithSubject() {
    this.sessionSubscribe = this.studentService
      .listLiveSession()
      .subscribe(async (sessionLiveList: any) => {
        this.originalSessionList = [];
        for await (const sessionLive of sessionLiveList) {
          await sessionLive.session_ref.parent.parent
            .get()
            .then((actionSubject: any) => {
              this.originalSessionList.push({
                subject: actionSubject.data(),
                ...sessionLive
              });
            });
        }
        this.sessionList = _.cloneDeep(this.originalSessionList);
        this.totalRecords = sessionLiveList.length;
        this.loading = false;
      });
  }

  onSearchChange($event) {
    console.log("$event :", $event);
    console.log("search change :");
  }
}
