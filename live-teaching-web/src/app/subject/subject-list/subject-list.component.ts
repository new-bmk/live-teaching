import { Component, OnInit } from "@angular/core";
import { LazyLoadEvent, MessageService } from "primeng/components/common/api";
import { Router } from "@angular/router";
import { SubjectService } from "../subject.service";

@Component({
  selector: "app-subject-list",
  templateUrl: "./subject-list.component.html",
  styleUrls: ["./subject-list.component.scss"]
})
export class SubjectListComponent implements OnInit {
  rowsPerPage = 10;
  rowsPerPageOptions = [10, 50, 100];
  loading = true;
  subjects: any[];
  totalRecords: number;
  currentRecordOffset = 0;

  selectedSubjects: any;

  currentOption: any = {};

  constructor(private router: Router, private subjectService: SubjectService) {}

  ngOnInit() {
    this.initFilters();
  }

  private initFilters() {
    this.currentOption.title = null;
  }

  private loadTable(
    offset: number,
    max: number,
    filter?: any,
    sort?: string,
    order?: number
  ) {
    const orderString = order === 1 ? "asc" : "desc";
    this.currentRecordOffset = offset;
    this.loading = true;
    this.subjectService
      .listSubjects(offset, max, filter, sort, orderString)
      .subscribe(({ results, totalCount }) => {
        this.subjects = results;
        this.totalRecords = totalCount;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
  }

  loadLazy($event: LazyLoadEvent) {
    this.loadTable(
      $event.first,
      $event.rows,
      $event.filters,
      $event.sortField,
      $event.sortOrder
    );
  }

  onResetFilter(dt) {
    dt.reset();
    dt.clearState();
    this.currentOption.code = "";
  }

  onRowSelect(event) {
    console.log("select : ", event.data);
  }

  onRowUnselect(event) {
    console.log("unselect : ", event.data);
  }
}
