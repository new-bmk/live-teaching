import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentService } from './student.service';
import { FormGroup, FormControl } from '@angular/forms';
import { debounce, map, mergeMap, takeUntil } from 'rxjs/operators';
import { interval, forkJoin, Subject } from 'rxjs';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
  // providers: [MessageService]
})
export class StudentComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  sessionList;
  originalSessionList;
  loading = true;
  totalRecords;
  row = 20;
  sessionSubscribe;
  cols;
  searchForm = new FormGroup({
    searchText: new FormControl('')
  });
  searchSubscribe;
  studentId;
  constructor(
    private studentService: StudentService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        field: 'id',
        header: 'Id'
      }
    ];
    this.listLiveSessionWithSubject();
    const formControl = this.searchForm.controls['searchText'];
    this.authService.getEndUser
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((auth: any) => {
        this.studentId = auth.studentId;
      });
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

  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  joinLiveSession(liveSessionId) {
    this.loading = true;
    this.studentService
      .joinLiveSession(liveSessionId, this.studentId)
      .subscribe((data: any) => {
        if (data.valid) {
          this.messageService.add({
            severity: 'success',
            summary: 'เข้าใช้งานสำเร็จ'
          });
          this.router.navigate(['/student/live-session', liveSessionId]);
          this.loading = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'เข้าใช้งานไม่สำเร็จ',
            detail: `เนื่องจาก ${data.reason}`
          });
        }
      });
  }
}
