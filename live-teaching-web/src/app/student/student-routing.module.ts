import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StudentComponent } from "./student.component";
import { StudentLiveComponent } from "./student-live/student-live.component";

const routes: Routes = [
  { path: "student", component: StudentComponent },
  { path: "student/live-session/:id", component: StudentLiveComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
