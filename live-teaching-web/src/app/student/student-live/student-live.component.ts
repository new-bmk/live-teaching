import { Component, OnInit, OnDestroy } from "@angular/core";
import { StudentService } from "../student.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { filter } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: "app-student-live",
  templateUrl: "./student-live.component.html",
  styleUrls: ["./student-live.component.scss"]
})
export class StudentLiveComponent implements OnInit, OnDestroy {
  quizList = [];

  quizForm = new FormGroup({
    anwser: new FormControl("", Validators.required)
  });

  activeQuizIndex = -1;
  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {}

  liveSessionSubscribe;
  displayBasic = true;
  loading = true;
  srcUrl = "";

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    // this.studentService.snapshotLiveSession(id).subscribe((data: any) => {
    //   console.log("data :", data);
    //   if (_.isEmpty(this.quizList)) {
    //     this.getQuiz(data.session_ref);
    //   }
    // });

    this.studentService
      .getRecordedSession("CIAcia7eVR378f9z1VtM")
      .subscribe((data: any) => {
        console.log("data :", data);
        // this.snapshotLiveSession(data.live_session_ref);
        this.getQuiz(data.session_ref);
        // this.srcUrl = "https://www.youtube.com/live_chat?v=-7_ZuR7gFgc&embed_domain=localhost";
        this.srcUrl = "https://www.youtube.com/embed/-7_ZuR7gFgc?autoplay=1";
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.liveSessionSubscribe.unsubscribe();
  }

  get stramURL() {
    return this.srcUrl;
  }

  snapshotLiveSession(liveSessionRef) {
    this.liveSessionSubscribe = this.studentService
      .snapshotLiveSessionWithRef(liveSessionRef)
      .subscribe((data: any) => {
        console.log("data :", data);
        this.activeQuizIndex = data.active_question_idx;
      });
  }

  getQuiz(session_ref) {
    this.studentService
      .listQuestionWithRef(session_ref)
      .pipe(
        filter((quiz: any) => {
          return true;
        })
      )
      .subscribe((data: any) => {
        this.quizList = data.questions;
        this.activeQuizIndex = 0;
        console.log("this.quizList :", this.quizList);
      });
  }

  submitQuestion() {
    if (this.quizForm.invalid) {
      return;
    }
    this.displayBasic = false;
    this.clearQuizForm();
  }

  clearQuizForm() {
    this.quizForm.reset();
  }
}