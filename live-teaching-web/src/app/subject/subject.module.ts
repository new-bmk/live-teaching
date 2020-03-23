import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";
import { ButtonModule } from "primeng/button";
import { TabViewModule } from "primeng/tabview";
import { DropdownModule } from "primeng/dropdown";
import { ContextMenuModule } from "primeng/contextmenu";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { InputMaskModule } from "primeng/inputmask";
import { BreadcrumbModule } from "primeng/breadcrumb";

import { DialogModule } from "primeng/dialog";
import { SubjectCrudComponent } from "./subject-crud/subject-crud.component";
import { SessionCrudComponent } from "./session-crud/session-crud.component";
import { PanelModule } from "primeng/panel";
import { SubjectRoutingModule } from "./subject-routing.module";
import { QuestionModule } from "../question/question.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TableModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    DropdownModule,
    ContextMenuModule,
    ProgressSpinnerModule,
    TabViewModule,
    FormsModule,
    ToastModule,
    TooltipModule,
    InputMaskModule,
    BreadcrumbModule,
    DialogModule,
    PanelModule,
    SubjectRoutingModule,
    QuestionModule
  ],
  exports: [SubjectCrudComponent, SessionCrudComponent],
  declarations: [
    SubjectCrudComponent,
    SessionCrudComponent
  ]
})
export class SubjectModule {}
