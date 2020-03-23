import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { TableModule } from 'primeng/table';
import { StudentLiveComponent } from './student-live/student-live.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { QuizAnswerEntryInputComponent } from './quiz-answer-entry-input/quiz-answer-entry-input.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedModule } from '../shared/shared.module';
import { ToastModule } from 'primeng/toast';
@NgModule({
  declarations: [
    StudentComponent,
    StudentLiveComponent,
    QuizAnswerEntryInputComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    StudentRoutingModule,
    TableModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    InputTextModule,
    DialogModule,
    RadioButtonModule,
    SharedModule,
    ToastModule
  ]
})
export class StudentModule {}
