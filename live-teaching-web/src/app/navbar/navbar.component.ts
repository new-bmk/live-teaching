import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user
  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.afAuth.user.subscribe(user=>{
      if(user)
       this.user = user.providerData[0]
       console.log(this.user)
    })
  }

  logout(){
    this.authService.signOut()
  }

}
