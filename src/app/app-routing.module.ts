import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { UserComponent } from "./users/user/user.component";

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "/users",
    pathMatch: "full"
  },

  {
    path: "users",
    component: UsersComponent
  },
  {
    path: "users/:id/:name",
    component: UserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
