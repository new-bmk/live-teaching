import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SubjectRoutingModule } from "./subject-routing.module";
import { SubjectCreateComponent } from "./subject-create/subject-create.component";
import { SubjectEditComponent } from "./subject-edit/subject-edit.component";
import { SubjectListComponent } from "./subject-list/subject-list.component";
import { SubjectFormComponent } from "./subject-form/subject-form.component";
import { TableModule } from "primeng/table";
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    SubjectCreateComponent,
    SubjectEditComponent,
    SubjectListComponent,
    SubjectFormComponent
  ],
  imports: [CommonModule, SubjectRoutingModule, TableModule, ButtonModule],
  exports: [
    SubjectCreateComponent,
    SubjectEditComponent,
    SubjectListComponent,
    SubjectFormComponent
  ]
})
export class SubjectModule {}
