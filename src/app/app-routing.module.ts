import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { ProfileChangeComponent } from '@app/shared/components';
import { CanActivateAppGuard } from './can-activate-app.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ CanActivateAppGuard ],
    children: [
      { path: '', redirectTo: '/goods', pathMatch: 'full' },
      { path: 'profile-change/:profileId', component: ProfileChangeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      anchorScrolling: 'disabled',
      scrollPositionRestoration: 'enabled',
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
