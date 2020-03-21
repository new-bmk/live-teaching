import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MockSessionComponent } from "./mock-session/mock-session.component";

const routes: Routes = [
  {
    path: "mock-session",
    component: MockSessionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionRoutingModule {}
