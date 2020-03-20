import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import { SortEvent, LazyLoadEvent } from "primeng/api";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from "../../../../node_modules/@angular/forms";
import { SubjectService } from "../subject.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-session-crud",
  templateUrl: "./session-crud.component.html",
  styleUrls: ["./session-crud.component.scss"]
})
export class SessionCrudComponent implements OnInit {
  subject = {
    id: "00001",
    name: "Introduction to Programming",
    publicity: "public",
    sessions: [
      { id: "001", url: "www.youtube.com/live001", questions: [{}] },
      { id: "002", url: "www.youtube.com/live002", questions: [] }
    ]
  };

  selectedSessionId = null;
  displayDialog = false;
  sessionsFormGroup: FormGroup;

  // use for add new session
  sessionTemplate: FormGroup;

  constructor() {}

  formInitialValue: any = {
    id: "",
    url: ""
  };

  ngOnInit() {
    this.sessionsFormGroup = new FormGroup({});
    this.sessionTemplate = new FormGroup({});

    _.each(
      // is required use :=> field:  new FormControl('', Validators.required),
      {
        id: new FormControl(""),
        name: new FormControl(""),
        publicity: new FormControl(""),
        sessions: new FormArray([])
      },
      (v, k) => this.sessionsFormGroup.addControl(k, v)
    );

    _.each(
      // is required use :=> field:  new FormControl('', Validators.required),
      {
        id: new FormControl("")
      },
      (v, k) => this.sessionTemplate.addControl(k, v)
    );

    //TODO set data with real fetch subject by subject id
    this.setData(this.subject);
  }

  setData(data: any) {
    console.log("data", data);
    if (data) {
      if (data.sessions) {
        console.log("has session length ", data.sessions.length);
        for (let i = 0; i < data.sessions.length; i++) {
          this.addSessionForm();
        }
        this.sessionsFormGroup.patchValue(data);
        console.log("form", this.sessionsFormGroup);
      }
    }
  }

  // ------ Session ----------------------------------------------------------------------
  createSessionForm(value?: any): FormGroup {
    console.log("create session form");
    const sessionForm = new FormGroup({
      id: new FormControl(""),
      url: new FormControl("")
    });
    if (value) {
      sessionForm.patchValue(value)
    }
    return sessionForm
  }

  addSessionForm(value?: any) {
    const items = this.sessionsFormGroup.get("sessions") as FormArray;
    items.push(this.createSessionForm(value));
  }

  removeSessionForm(index: number) {
    const items = this.sessionsFormGroup.get("sessions") as FormArray;
    items.removeAt(index);
  }

  save (data) {
    console.log('save', data)
    this.addSessionForm(data)

    this.displayDialog = false;
  }
  // -------------------------------------------------------------------------------------

  onRowSelect($event) {
    console.log("select row", $event);
    this.selectedSessionId = $event.data.id;
  }

  onClickAddButton() {
    this.showDialogToAdd();
  }

  onClickLive(sessionId) {
    console.log("Go live");
    const sessions = this.sessionsFormGroup.get("sessions") as FormArray;
    const session = _.find(sessions.value, it => {
      return it.id === sessionId;
    });
    if (session) {
      //TODO go live
      console.log("live url: ", session.url);
    }
  }

  get hasSelectedSession() {
    return this.selectedSessionId !== null;
  }

  getSelectedRowIndex(sessionId) {
    const sessions = this.sessionsFormGroup.get("sessions") as FormArray;
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
}
