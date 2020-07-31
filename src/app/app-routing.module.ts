import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { AuthService } from "@app/core/http";

const routes: Routes = [
  // { path: '', redirectTo: '/goods', pathMatch: 'full'},
  {
    path: '',
    redirectTo: (authService: AuthService) => {
      console.log(authService);
      return ['groups', 'naver', 'goods'];
    },
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
