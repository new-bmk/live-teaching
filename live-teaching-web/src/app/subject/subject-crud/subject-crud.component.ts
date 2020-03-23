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
  selector: "app-subject-crud",
  templateUrl: "./subject-crud.component.html",
  styleUrls: ["./subject-crud.component.scss"]
})
export class SubjectCrudComponent implements OnInit {
  displayDialog: boolean;

  subject: any = {};
  newSubject: boolean;
  subjectList: any[];
  subjectForm: FormGroup;
  submitted: boolean = false;

  loading: boolean;
  totalRecords: number;
  currentOption: any = {};

  lang: any = {};

  constructor(private subjectService: SubjectService, private router: Router) {}

  private refreshData() {
    this.loading = true;
    this.subjectService
      .listSubjects(0, 999, null, "title", 1)
      .subscribe(({ results, totalCount }) => {
        this.subjectList = results;
        this.loading = false;
        this.totalRecords = totalCount;
      });
  }

  private loadSubjects(
    offset: number,
    max: number,
    filter?: any,
    sort?: string,
    order?: number
  ) {
    const orderString = order === 1 ? "asc" : "desc";
    this.loading = true;
    this.subjectService
      .listSubjects(offset, max, filter, sort, orderString)
      .subscribe(({ results, totalCount }) => {
        this.subjectList = results;
        this.totalRecords = totalCount;
        this.loading = false;
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
    id: "",
    name: "",
    color: "#000000",
    publicity: "",
    sessions: []
  };

  ngOnInit() {
    this.subjectForm = new FormGroup({
      id: new FormControl(""),
      name: new FormControl(""),
      color: new FormControl("#000000"),
      publicity: new FormControl(""),
      sessions: new FormArray([])
    });

    this.refreshData();

    this.initFilters();
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
        .subscribe(() => {
          this.refreshData();
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Subject",
          //   detail: `Subject has been create`
          // });
          // this.logger.debug(`Subject has been created.`);
        });
    } else {
      let id = this.subject._id;
      delete this.subject._id;
      this.subjectService
        .updateSubject(id, this.subjectForm.value)
        .subscribe(() => {
          this.refreshData();
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Subject",
          //   detail: `Id [${id}] has been update`
          // });
          // this.logger.debug(`Subject [${id}] has been updated.`);
        });
    }
    this.subject = {};
    this.displayDialog = false;
    this.submitted = false;
  }

  delete() {
    this.subjectService.deleteSubject(this.subject._id).subscribe(({ ok }) => {
      if (ok) {
        this.refreshData();
        // this.messageService.add({
        //   severity: "success",
        //   summary: "Subject",
        //   detail: `Id [${this.subject._id}] has been delete}`
        // });
        // this.logger.debug(`Subject [${this.subject._id}] has been deleted.`);
      } else {
        // this.messageService.add({
        //   severity: "error",
        //   summary: "Subject",
        //   detail: `Id [${this.subject._id}] cannot delete`
        // });
        // this.logger.debug(`Subject [${this.subject._id}] hasn't been deleted.`);
      }
      this.subject = {};
    });
    this.displayDialog = false;
    this.submitted = false;
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
