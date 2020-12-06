import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/goods', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
    anchorScrolling: 'disabled',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
}
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
