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
    id: 241 - 202,
    publicity: "public",
    sessions: [
      { id: "001", url: "www.youtube.com/live001" },
      { id: "002", url: "www.youtube.com/live001" }
    ]
  };

  sessionsFormGroup: FormGroup;

  constructor() {}

  formInitialValue: any = {
    id: "",
    url: ""
  };

  ngOnInit() {
    this.sessionsFormGroup = new FormGroup({})

    _.each(
      // is required use :=> field:  new FormControl('', Validators.required),
      {
        sessions: new FormArray([])
      },
      (v, k) => this.sessionsFormGroup.addControl(k, v)
    );

    this.setData (this.subject)
  }

  setData (data: any) {
    console.log('data', data)
    if (data) {
      if(data.sessions) {
        console.log('has session length ', data.sessions.length)
        for(let i = 0 ; i < data.sessions.length ; i++) { 
          this.addSessionForm()
        }
        this.sessionsFormGroup.patchValue({sessions: data.sessions})
        console.log('form', this.sessionsFormGroup)
      }
    }
  }

  // Session
  createSessionForm(): FormGroup {
    console.log('create session form')
    return new FormGroup({
      id: new FormControl(""),
      url: new FormControl("")
    });
  }

  addSessionForm() {
    const items = this.sessionsFormGroup.get("sessions") as FormArray;
    items.push(this.createSessionForm());
  }

  removeSessionForm(index: number) {
    const items = this.sessionsFormGroup.get("sessions") as FormArray;
    items.removeAt(index);
  }

  onRowSelect () {
    
  }
}
