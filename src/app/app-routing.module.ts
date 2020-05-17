import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PostComponent } from "./components/posts/post/post.component";

const routes: Routes = [
  // ruta base (127.0.0.1 redirecciona a .../home)
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () =>
      import("./components/pages/home/home.module").then((m) => m.HomeModule),
  },

  { path: "post/:id", component: PostComponent },
  {
    path: "about",
    loadChildren: () =>
      import("./components/pages/about/about.module").then(
        (m) => m.AboutModule
      ),
  },
  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  // {
  //   path: "posts",
  //   loadChildren: () =>
  //     import("./components/posts/list-posts/list-posts.module").then(
  //       (m) => m.ListPostsModule
  //     ),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
