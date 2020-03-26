import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "../auth/auth.service";
import { MessageService } from "primeng/components/common/messageservice";
import * as _ from "lodash";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  userAuth;
  user;

  isSelectedRole: boolean = false;
  isTeacher: boolean;

  profileForm = new FormGroup({
    name: new FormControl(""),
    studentId: new FormControl("")
  });

  constructor(
    private fireStore: AngularFirestore,
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.userAuth = user;
        if (this.userAuth.providerData[0]) {
          let id = this.userAuth.providerData[0].email.split("@psu.ac.th")[0];
          if (isNaN(+id)) {
            this.isSelectedRole = true;
            this.isTeacher = true;
          } else {
            this.isSelectedRole = true;
            this.isTeacher = false;
          }
          this.profileForm.patchValue({
            name: this.userAuth.providerData[0].email.split("@")[0],
            studentId: !isNaN(+id) ? id : ""
          });
        }
      }
    });
  }

  unChoose() {
    this.isSelectedRole = false;
  }

  chooseTeacher() {
    this.isSelectedRole = true;
    this.isTeacher = true;
  }

  chooseStudent() {
    this.isSelectedRole = true;
    this.isTeacher = false;
  }

  register() {
    this.profileForm.disable();
    this.fireStore
      .collection("user")
      .add({
        ...this.profileForm.value,
        email: this.userAuth.email,
        role: this.isTeacher ? "teacher" : "student"
      })
      .then(() => {
        this.authService.setUser(this.userAuth, endUser => {
          if (_.isEmpty(endUser)) {
            this.user = null;
            this.signOut();
          } else {
            this.user = endUser[0];
            if (this.user.role === "teacher") {
              this.router.navigate(["/teacher"], { replaceUrl: true });
            } else {
              this.router.navigate(["/student"], { replaceUrl: true });
            }
          }
        });
      });
  }

  signOut() {
    this.authService.signOut();
  }
}
