import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  isSelectedRole: boolean = false;
  isTeacher: boolean;
  name: string;
  studentId: string;
  
  constructor() {}

  ngOnInit() {}

  chooseTeacher() {
    this.isSelectedRole = true;
    this.isTeacher = true;
  }

  chooseStudent() {
    this.isSelectedRole = true;
    this.isTeacher = false;
  }
}
