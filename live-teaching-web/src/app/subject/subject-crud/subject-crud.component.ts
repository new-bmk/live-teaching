import { Component, OnInit } from '@angular/core';
import { SortEvent, LazyLoadEvent, MessageService } from 'primeng/api';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
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
  styleUrls: ['./subject-crud.component.scss'],
})
export class SubjectCrudComponent implements OnInit {
  private unsubscribe$ = new Subject();

  displayDialog: boolean;

  subject: any = {};
  newSubject: boolean;
  subjectList: any[];
  subjectForm: FormGroup;
  loading: boolean = false;

  authData: any;
  subscribeEndUser: any;
  subscribeSubject: any;

  totalRecords: number;
  currentOption: any = {};

  lang: any = {};

  publicityOptions = [
    {
      label: 'private',
      value: 'private',
    },
    {
      label: 'public',
      value: 'public',
    },
  ];

  constructor(
    private subjectService: SubjectService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  private refreshData() {
    this.loading = true;
    this.subjectService
      .listSubjects(0, 999, { email: this.authData.email }, 'title', 1)
      .subscribe((results) => {
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
    const filterWithEmail = {
      ...filter,
      email: this.authData.email,
    };
    this.subscribeSubject = this.subjectService
      .listSubjects(offset, max, { ...filterWithEmail }, sort, orderString)
      .subscribe((results) => {
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
    moderators: [],
  };

  ngOnInit() {
    // this.authService.getEndUser
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((auth: any) => {
    //     console.log('auth :', auth);
    //   });
    this.loading = true;
    this.subjectForm = new FormGroup({
      id: new FormControl(''),
      title: new FormControl(''),
      color: new FormControl('#000000'),
      publicity: new FormControl(''),
      sessions: new FormArray([]),
      moderators: new FormControl([]),
    });

    this.subscribeEndUser = this.authService.getEndUser
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((auth: any) => {
        if (!_.isEmpty(auth)) {
          this.authData = auth;
          this.formInitialValue.moderators = [auth.email];
          this.subjectForm.reset(this.formInitialValue);
          this.refreshData();
          this.loading = false;
        }
      });

    this.initFilters();
  }

  ngOnDestroy() {
    if (this.subscribeEndUser) {
      this.subscribeEndUser.unsubscribe();
    }
    if (this.subscribeSubject) {
      this.subscribeSubject.unsubscribe();
    }
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
    this.subjectForm.patchValue({ color: this.getRandomColor() });
    this.newSubject = true;
    this.subject = {};
    this.displayDialog = true;
  }

  onDialogHide() {
    this.loading = false;
    this.subjectForm.reset(this.formInitialValue);
  }

  save() {
    this.loading = true;
    this.subjectForm.disable();
    if (this.subjectForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Subject',
        detail: `Subject cannot create`,
      });
      // this.logger.error(`Subject form invalid fail to created.`)
      return;
    }
    if (this.newSubject) {
      this.subjectService
        .createSubject(this.subjectForm.value)
        .then(() => {
          this.refreshData();
          this.messageService.add({
            severity: 'success',
            summary: 'Subject',
            detail: `Subject has been create`,
          });
          // this.logger.debug(`Subject has been created.`);
        })
        .finally(() => {
          this.subject = {};
          this.displayDialog = false;
          this.loading = false;
          this.subjectForm.enable();
        });
    } else {
      let id = this.subject.id;
      this.subjectService
        .updateSubject(id, this.subjectForm.value)
        .then(() => {
          this.refreshData();
          this.messageService.add({
            severity: 'success',
            summary: 'Subject',
            detail: `Id [${id}] has been update`,
          });
          // this.logger.debug(`Subject [${id}] has been updated.`);
        })
        .finally(() => {
          this.subject = {};
          this.displayDialog = false;
          this.loading = false;
          this.subjectForm.enable();
        });
    }
  }

  delete() {
    this.loading = true;
    this.subjectService
      .deleteSubject(this.subject.id)
      .then(() => {
        this.refreshData();
        this.subject = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Subject',
          detail: `Subject has been delete`,
        });
      })
      .finally(() => {
        this.displayDialog = false;
        this.loading = false;
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
    this.loading = false;
  }

  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
}
