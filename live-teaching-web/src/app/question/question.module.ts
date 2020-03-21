import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { QuestionRoutingModule } from "./question-routing.module";
import { QuestionEntryInputComponent } from "./question-entry-input/question-entry-input.component";
import { MockSessionComponent } from "./mock-session/mock-session.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [QuestionEntryInputComponent, MockSessionComponent],
  imports: [CommonModule, QuestionRoutingModule, ReactiveFormsModule],
  exports: [QuestionEntryInputComponent]
})
export class QuestionModule {}
