import { Component, OnInit, OnDestroy } from "@angular/core";
import { StudentService } from "./student.service";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.scss"]
})
export class StudentComponent implements OnInit, OnDestroy {
  sessionList;
  loading = true;
  totalRecords;
  row = 20;
  sessionSubscribe;
  cols;
  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.cols = [
      {
        field: "id",
        header: "Id"
      }
    ];
    this.sessionSubscribe = this.studentService
      .listLiveSession()
      .subscribe((data: any) => {
        this.sessionList = data;
        this.totalRecords = data.length;
        this.loading = false;
      });
  }
  ngOnDestroy() {
    this.sessionSubscribe();
  }

  loadCarsLazy(event: any) {
    // this.loading = true;
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    //imitate db connection over a network
  }
}
