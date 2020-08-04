import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { ProfileChangeComponent } from '@app/shared/components';

const routes: Routes = [
  { path: '', redirectTo: '/goods', pathMatch: 'full'},
  { path: 'profile-change/:profileId', component: ProfileChangeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
