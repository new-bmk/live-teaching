import { Component, OnInit } from "@angular/core";
import { StudentService } from "../student.service";
import { FormGroup } from "@angular/forms";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-student-live",
  templateUrl: "./student-live.component.html",
  styleUrls: ["./student-live.component.scss"]
})
export class StudentLiveComponent implements OnInit {
  quizList = [];

  quizForm = new FormGroup({});
  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.studentService
      .listQuestion(
        "subject/HK0OFtBINF5EY5o2zrml/sessions/B6EWvvy59XjrPjBdzbyr"
      )
      .pipe(
        filter((quiz: any) => {
          return true;
        })
      )
      .subscribe((data: any) => {
        console.log("data :", data);
      });
  }
}
