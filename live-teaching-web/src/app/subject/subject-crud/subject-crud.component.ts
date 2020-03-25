import { Component, OnInit } from '@angular/core';
import { SortEvent, LazyLoadEvent } from 'primeng/api';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '../../../../node_modules/@angular/forms';
import { SubjectService } from '../subject.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-subject-crud',
  templateUrl: './subject-crud.component.html',
  styleUrls: ['./subject-crud.component.scss']
})
export class SubjectCrudComponent implements OnInit {
  private unsubscribe$ = new Subject();

  displayDialog: boolean;

  subject: any = {};
  newSubject: boolean;
  subjectList: any[];
  subjectForm: FormGroup;
  submitted: boolean = false;

  authData: any;
  subscribeEndUser: any;
  subscribeSubject: any;

  loading: boolean;
  totalRecords: number;
  currentOption: any = {};

  lang: any = {};

  publicityOptions = [
    {
      label: 'private',
      value: 'private'
    },
    {
      label: 'public',
      value: 'public'
    }
  ];

  constructor(
    private subjectService: SubjectService,
    private authService: AuthService,
    private router: Router
  ) {}

  private refreshData() {
    this.loading = true;
    this.subjectService
      .listSubjects(0, 999, { email: this.authData.email }, 'title', 1)
      .subscribe(results => {
        if (results) {
          this.subjectList = results;
          this.loading = false;
          this.totalRecords = results.length || 0;
        }
      });
  }

  private loadSubjects(
    offset: number,
    max: number,
    filter?: any,
    sort?: string,
    order?: number
  ) {
    const orderString = order === 1 ? 'asc' : 'desc';
    this.loading = true;
    this.subscribeSubject = this.subjectService
      .listSubjects(
        offset,
        max,
        { ...filter, email: this.authData.email },
        sort,
        orderString
      )
      .subscribe(results => {
        this.subjectList = results;
        this.loading = false;
        // this.totalRecords = totalCount;
      });
  }
  loadSubjectsLazy($event: LazyLoadEvent) {
    this.loadSubjects(
      $event.first,
      $event.rows,
      $event.filters,
      $event.sortField,
      $event.sortOrder
    );
  }

  formInitialValue: any = {
    id: '',
    title: '',
    color: '#000000',
    publicity: 'public',
    sessions: [],
    moderators: []
  };

  ngOnInit() {
    // this.authService.getEndUser
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((auth: any) => {
    //     console.log('auth :', auth);
    //   });
    this.subjectForm = new FormGroup({
      id: new FormControl(''),
      title: new FormControl(''),
      color: new FormControl('#000000'),
      publicity: new FormControl(''),
      sessions: new FormArray([]),
      moderators: new FormControl([])
    });

    this.subscribeEndUser = this.authService.getEndUser
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((auth: any) => {
        if (!_.isEmpty(auth)) {
          this.authData = auth;
          this.formInitialValue.moderators = [auth.email];
          this.subjectForm.reset(this.formInitialValue);
          this.refreshData();
        }
      });

    this.initFilters();
  }

  ngOnDestroy() {
    this.subscribeEndUser.unsubscribe();
    this.subscribeSubject.unsubscribe();
  }

  get f() {
    return this.subjectForm.controls;
  }

  private initFilters() {
    this.currentOption.title = null;
  }

  onResetFilter(dt) {
    dt.reset();
    dt.clearState();
  }

  showDialogToAdd() {
    this.newSubject = true;
    this.subject = {};
    this.displayDialog = true;
  }

  onDialogHide() {
    this.submitted = false;
    this.subjectForm.reset(this.formInitialValue);
  }

  save() {
    this.submitted = true;
    if (this.subjectForm.invalid) {
      // this.messageService.add({
      //   severity: "error",
      //   summary: "Subject",
      //   detail: `Subject cannot create`
      // });
      // this.logger.error(`Subject form invalid fail to created.`)
      return;
    }
    if (this.newSubject) {
      this.subjectService
        .createSubject(this.subjectForm.value)
        .then(() => {
          this.refreshData();
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Subject",
          //   detail: `Subject has been create`
          // });
          // this.logger.debug(`Subject has been created.`);
        })
        .finally(() => {
          this.subject = {};
          this.displayDialog = false;
          this.submitted = false;
        });
    } else {
      let id = this.subject.id;
      this.subjectService
        .updateSubject(id, this.subjectForm.value)
        .then(() => {
          this.refreshData();
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Subject",
          //   detail: `Id [${id}] has been update`
          // });
          // this.logger.debug(`Subject [${id}] has been updated.`);
        })
        .finally(() => {
          this.subject = {};
          this.displayDialog = false;
          this.submitted = false;
        });
    }
  }

  delete() {
    this.subjectService
      .deleteSubject(this.subject.id)
      .then(() => {
        this.subject = {};
      })
      .finally(() => {
        this.displayDialog = false;
        this.submitted = false;
      });
  }

  onRowSelect(event) {}

  customSort(event: SortEvent) {
    let data = _.sortBy(event.data, [event.field]);
    if (event.order < 0) data = _.reverse(data);

    this.subjectList = data;
  }

  onClickSessionManageButton(subjectId) {
    this.router.navigate([`/subject`, subjectId, `session`]);
  }

  onClickEditButton(data) {
    this.newSubject = false;
    this.subject = _.clone(data);
    this.subjectForm.patchValue(this.subject);
    this.displayDialog = true;
    this.submitted = true;
  }
}
