import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import {
  FormArray,
  FormControl,
  FormGroup,
} from '../../../../node_modules/@angular/forms';
import { SessionCrudService } from './session-crud.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-session-crud',
  templateUrl: './session-crud.component.html',
  styleUrls: ['./session-crud.component.scss'],
})
export class SessionCrudComponent implements OnInit {
  loading = false;
  subject = {};
  subjectId: string;

  selectedSessionId = null;
  displayDialog = false;
  sessionsFormGroup: FormGroup;

  // use for add new session
  sessionTemplate: FormGroup;

  // ---------- live session ---------
  liveSessionDisplayDialog = false;
  liveSessionTemplate: FormGroup;
  currentLiveSessionId: any;
  subscribeLiveSession: Subscription;

  constructor(
    private sessionCrudService: SessionCrudService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.sessionsFormGroup = new FormGroup({});
    this.sessionTemplate = new FormGroup({});

    _.each(
      // is required use :=> field:  new FormControl('', Validators.required),
      {
        sessions: new FormArray([]),
      },
      (v, k) => this.sessionsFormGroup.addControl(k, v)
    );

    _.each(
      // is required use :=> field:  new FormControl('', Validators.required),
      {
        title: new FormControl(''),
        questions: new FormArray([]),
        // scheduled: new FormGroup({})
      },
      (v, k) => this.sessionTemplate.addControl(k, v)
    );

    // ------------ live session -----------------
    this.liveSessionTemplate = new FormGroup({});
    _.each(
      // is required use :=> field:  new FormControl('', Validators.required),
      {
        stream_url: new FormControl(''),
      },
      (v, k) => this.liveSessionTemplate.addControl(k, v)
    );

    // ------ load session ------
    this.subjectId = this.route.snapshot.paramMap.get('subjectId');
    this.sessionCrudService
      .loadSession(this.subjectId)
      .subscribe((sessions) => {
        this.clearSessionForm();
        console.log(sessions);
        this.setData({
          sessions,
        });
        this.loading = false;
      });
  }

  ngOnDestroy() {
    if (this.subscribeLiveSession) {
      this.subscribeLiveSession.unsubscribe();
    }
  }

  back() {
    this.location.back();
  }

  setData(data: any) {
    console.log('data', data);
    if (data) {
      if (data.sessions) {
        console.log('has session length ', data.sessions.length);
        for (let i = 0; i < data.sessions.length; i++) {
          this.addSessionForm();
        }
        this.sessionsFormGroup.patchValue(data);
        console.log('form', this.sessionsFormGroup);
      }
    }
  }

  // ------ Session ----------------------------------------------------------------------
  createSessionForm(value?: any): FormGroup {
    console.log('create session form');
    const sessionForm = new FormGroup({
      id: new FormControl(''),
      title: new FormControl(''),
      questions: new FormControl([]),
    });
    if (value) {
      sessionForm.patchValue(value);
    }
    return sessionForm;
  }

  addSessionForm(value?: any) {
    const items = this.sessionsFormGroup.get('sessions') as FormArray;
    items.push(this.createSessionForm(value));
  }

  removeSessionForm(index: number) {
    const items = this.sessionsFormGroup.get('sessions') as FormArray;
    items.removeAt(index);
  }

  clearSessionForm() {
    const items = this.sessionsFormGroup.get('sessions') as FormArray;
    items.clear();
  }

  save(data) {
    this.loading = true;
    console.log('save', data);
    this.addSessionForm(data);

    this.sessionCrudService
      .createSession(this.subjectId, data)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Session',
          detail: `Session has been create`,
        });
        this.sessionTemplate.patchValue({ id: '', title: '', questions: [] });
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Session save fail',
          detail: error.message,
        });
      })
      .finally(() => {
        this.displayDialog = false;
        this.loading = false;
      });
  }

  delete(sessionId) {
    this.loading = true;
    console.log('delete', this.getSelectedRowIndex(sessionId));
    this.selectedSessionId = null;

    this.sessionCrudService
      .deleteSession(this.subjectId, sessionId)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Session',
          detail: `Session has been delete`,
        });
        this.removeSessionForm(this.getSelectedRowIndex(sessionId));
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Session delete fail',
          detail: error.message,
        });
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  update(sessionId) {
    this.loading = true;
    console.log('update', this.getSelectedRowIndex(sessionId));
    const items = this.sessionsFormGroup.get('sessions') as FormArray;
    const values = items.at(this.getSelectedRowIndex(sessionId)).value;
    // this.clearSessionForm();

    this.sessionCrudService
      .updateSession(this.subjectId, sessionId, values)
      .then(() => {
        this.selectedSessionId = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Session',
          detail: `Session has been update`,
        });
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Session update fail',
          detail: error.message,
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }
  // -------------------------------------------------------------------------------------

  onRowSelect($event) {
    console.log('select row', $event);
    this.selectedSessionId = $event.data.id;

    // ------ exist live sesion ---
    if (this.subscribeLiveSession) {
      this.currentLiveSessionId = null;
      this.subscribeLiveSession.unsubscribe();
    }
    this.subscribeLiveSession = this.sessionCrudService
      .getLiveSessionId(this.subjectId, this.selectedSessionId)
      .subscribe((liveSessionId) => {
        this.currentLiveSessionId = liveSessionId;
      });
  }

  onClickAddButton() {
    this.showDialogToAdd();
  }

  onClickLive(sessionId) {
    this.liveSessionDisplayDialog = true;
  }

  get hasSelectedSession() {
    return this.selectedSessionId !== null;
  }

  getSelectedRowIndex(sessionId) {
    const sessions = this.sessionsFormGroup.get('sessions') as FormArray;
    for (let i = 0; i < sessions.length; i++) {
      if (sessions.controls[i].value.id === sessionId) {
        return i;
      }
    }
    return null;
  }

  // ------ dialog ------------------------------------------------------------------------
  showDialogToAdd() {
    this.displayDialog = true;
  }

  onDialogHide() {}

  //  ----- live session -----------------
  showLiveSessionDialogToAdd() {
    this.liveSessionDisplayDialog = true;
  }

  onLiveSessionDialogHide() {}

  returnToLiveSession(sessionId) {
    this.router.navigate([
      `/teacher`,
      `live-session`,
      this.currentLiveSessionId,
    ]);
  }

  saveLiveSession(data) {
    this.loading = true;
    if (this.currentLiveSessionId) {
      return;
    }

    if (!_.isEmpty(data.stream_url) && !_.isEmpty(this.selectedSessionId)) {
      this.sessionCrudService
        .createLiveSession({
          stream_url: data.stream_url,
          subject_id: this.subjectId,
          session_id: this.selectedSessionId,
        })
        .then((result: any) => {
          if (result.status === 'ok') {
            this.router.navigate(
              [
                `/teacher`,
                `live-session`,
                _.get(result, 'data.liveSessionCreateResult.id'),
              ],
              { replaceUrl: true }
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Live Session',
              detail: `Live Session has been start`,
            });
          } else {
            throw new Error(_.get(result, 'reason'));
          }
        })
        .catch((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Live Session start fail',
            detail: error.message,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      console.error('invalid data');
      this.messageService.add({
        severity: 'error',
        summary: 'Live Session start fail',
        detail: `invalid data`,
      });
      this.loading = false;
    }
  }
}
