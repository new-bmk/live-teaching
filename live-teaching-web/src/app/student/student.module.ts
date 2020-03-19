import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StudentRoutingModule } from "./student-routing.module";
import { StudentComponent } from "./student.component";
import { TableModule } from "primeng/table";
import { StudentLiveComponent } from "./student-live/student-live.component";
import { ButtonModule } from "primeng/button";
@NgModule({
  declarations: [StudentComponent, StudentLiveComponent],
  imports: [CommonModule, StudentRoutingModule, TableModule, ButtonModule]
})
export class StudentModule {}
