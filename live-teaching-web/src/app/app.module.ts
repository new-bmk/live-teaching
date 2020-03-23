import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { LoginComponent } from "./login/login.component";
import { TeacherComponent } from "./teacher/teacher.component";
import { StudentComponent } from "./student/student.component";
import { RegisterComponent } from "./register/register.component";
import { NavbarComponent } from "./navbar/navbar.component";

import { MessageService } from "primeng/components/common/messageservice";
import { ButtonModule } from "primeng/button";
import { MenubarModule } from "primeng/menubar";
import { SubjectModule } from "./subject/subject.module";
import { CardModule } from "primeng/card";
import { ToastModule } from "primeng/toast";
import { QuestionModule } from "./question/question.module";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TeacherComponent,
    StudentComponent,
    RegisterComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    MenubarModule,
    SubjectModule,
    CardModule,
    ToastModule,
    QuestionModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
