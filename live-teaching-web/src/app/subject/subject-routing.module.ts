import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SubjectCrudComponent } from "./subject-crud/subject-crud.component";
import { SubjectManageComponent } from "./subject-manage/subject-manage.component";
// import { AuthGuardService as AuthGuard } from '@app/auth/auth-guard.service';

const routes: Routes = [
  // { path: "review", component: SubjectCrudComponent, canActivate: [AuthGuard] }
  { path: "subject", component: SubjectCrudComponent },
  { path: "subject/manage/:id", component: SubjectManageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectRoutingModule {}
