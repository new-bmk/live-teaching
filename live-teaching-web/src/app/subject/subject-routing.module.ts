import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SubjectCrudComponent } from "./subject-crud/subject-crud.component";
// import { AuthGuardService as AuthGuard } from '@app/auth/auth-guard.service';

const routes: Routes = [
  // { path: "review", component: SubjectCrudComponent, canActivate: [AuthGuard] }
  { path: "subject", component: SubjectCrudComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, SubjectCrudComponent]
})
export class SubjectRoutingModule {}
