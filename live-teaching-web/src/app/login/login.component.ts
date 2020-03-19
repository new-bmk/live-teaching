import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  loginFacebook() {
    this.authService.loginWithFacebook();
  }

  loginGoogle() {
    this.authService.loginWithGoogle();
  }
}
