import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import * as _ from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'live-teaching-web';
  user;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.registerAuthState();
  }

  registerAuthState() {
    this.afAuth.auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        this.authService.setUser(userAuth, endUser => {
          if (!_.isEmpty(endUser) || userAuth.email.includes('@psu.ac.th')) {
            if (_.isEmpty(endUser)) {
              this.user = null;
              this.authService.register(userAuth, user => {
                this.user = user;
              });
              this.router.navigate(['/register'], { replaceUrl: true });
            } else {
              this.user = endUser[0];
              if (this.user.role === 'teacher') {
                this.router.navigate(['/teacher'], { replaceUrl: true });
              } else {
                this.router.navigate(['/student'], { replaceUrl: true });
              }
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'แจ้งเตือน',
              detail:
                'กรุณาลงชื่อเข้าใช้ด้วยอีเมลที่ลงท้ายด้วย @psu.ac.th เท่านั้น'
            });
            this.signOut();
          }
        });
      } else {
        this.user = null;
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }

  signOut() {
    this.authService.signOut();
  }
}
