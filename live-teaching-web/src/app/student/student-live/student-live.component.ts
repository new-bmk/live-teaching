import { Component, OnInit } from "@angular/core";
import { StudentService } from "../student.service";
import { FormGroup } from "@angular/forms";
import { filter } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: "app-student-live",
  templateUrl: "./student-live.component.html",
  styleUrls: ["./student-live.component.scss"]
})
export class StudentLiveComponent implements OnInit {
  quizList = [];

  quizForm = new FormGroup({});

  activeQuizIndex = -1;
  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.studentService.getLiveSession(id).subscribe((data: any) => {
      console.log("data :", data);
      if (_.isEmpty(this.quizList)) {
        this.getQuiz(data.session_ref);
      }
    });
  }

  getQuiz(sessionId) {
    this.studentService
      .listQuestion(sessionId)
      .pipe(
        filter((quiz: any) => {
          return true;
        })
      )
      .subscribe((data: any) => {
        this.quizList = data.questions;
        console.log("this.quizList :", this.quizList);
      });
  }
}
