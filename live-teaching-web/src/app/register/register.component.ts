import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  userAuth;

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
        this.userAuth = user.providerData[0];
        this.profileForm.patchValue({
          name: this.userAuth.email.split("@")[0],
          studentId: this.userAuth.email.includes("@psu.ac.th")
            ? this.userAuth.email.split("@psu.ac.th")[0]
            : ""
        });
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
    console.log(this.userAuth);
    this.profileForm.disable();
    this.fireStore
      .collection("user")
      .add({
        ...this.profileForm.value,
        email: this.userAuth.email,
        role: this.isTeacher ? "teacher" : "student"
      })
      .then(() => {
        this.router.navigate(["/login"], { replaceUrl: true });
      });
  }

  signOut() {
    this.authService.signOut();
  }
}
