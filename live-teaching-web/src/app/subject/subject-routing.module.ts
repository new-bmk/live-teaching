import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SessionCrudComponent } from './session-crud/session-crud.component';
import { SubjectCrudComponent } from "./subject-crud/subject-crud.component";

const routes: Routes = [
  { path: "subject", component: SubjectCrudComponent },
  { path: "subject/:subjectId/session", component: SessionCrudComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectRoutingModule {}
