import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StudentRoutingModule } from "./student-routing.module";
import { StudentComponent } from "./student.component";
import { TableModule } from "primeng/table";
import { StudentLiveComponent } from "./student-live/student-live.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { InputTextModule } from "primeng/inputtext";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
@NgModule({
  declarations: [StudentComponent, StudentLiveComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    StudentRoutingModule,
    TableModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    InputTextModule
  ]
})
export class StudentModule {}
