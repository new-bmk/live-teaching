import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-mock-session",
  templateUrl: "./mock-session.component.html",
  styleUrls: ["./mock-session.component.scss"]
})
export class MockSessionComponent implements OnInit {
  sessionForm: FormGroup;
  constructor() {}

  ngOnInit() {
    this.sessionForm = new FormGroup({
      questions: new FormControl([])
    });
  }
}
