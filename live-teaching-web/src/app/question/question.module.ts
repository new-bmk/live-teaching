import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { PanelModule } from "primeng/panel";
import { QuestionEntryInputComponent } from "./question-entry-input/question-entry-input.component";

@NgModule({
  declarations: [QuestionEntryInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    PanelModule
  ],
  exports: [QuestionEntryInputComponent]
})
export class QuestionModule {}
