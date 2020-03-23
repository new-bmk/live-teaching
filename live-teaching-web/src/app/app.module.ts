import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { LoginComponent } from './login/login.component';
import { TeacherComponent } from './teacher/teacher.component';
import { RegisterComponent } from './register/register.component';
import { LiveSessionComponent } from './teacher/live-session/live-session.component';
import { NavbarComponent } from './navbar/navbar.component';

import { MessageService } from 'primeng/components/common/messageservice';
import { StudentModule } from './student/student.module';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SubjectModule } from './subject/subject.module';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SharedModule } from 'primeng/components/common/shared';
import { TableModule } from 'primeng/table';
import { QuestionModule } from './question/question.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireFunctionsModule, ORIGIN } from '@angular/fire/functions';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TeacherComponent,
    RegisterComponent,
    NavbarComponent,
    LiveSessionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireFunctionsModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    StudentModule,
    ToastModule,
    ButtonModule,
    MenubarModule,
    SubjectModule,
    CardModule,
    MenubarModule,
    OverlayPanelModule,
    SharedModule,
    TableModule,
    QuestionModule
  ],
  providers: [
    MessageService
    // { provide: ORIGIN, useValue: 'http://localhost:4200' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
