import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AuthService } from "./auth/auth.service";
import * as _ from "lodash";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "live-teaching-web";
  user;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerAuthState();
  }

  registerAuthState() {
    this.afAuth.auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        this.authService.setUser(userAuth, endUser => {
          if (_.isEmpty(endUser)) {
            this.user = null;
            this.router.navigate(["/register"], { replaceUrl: true });
            // this.authService.signOut();
          } else {
            this.user = userAuth;
            console.log(this.user)
            if (this.user.role === "teacher") {
              this.router.navigate(["/teacher"], { replaceUrl: true });
            } else {
              this.router.navigate(["/student"], { replaceUrl: true });
            }
          }
        });
      } else {
        this.user = null;
        this.router.navigate(["/login"], { replaceUrl: true });
      }
    });
  }
}
