import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '@app/modules/home/home/home.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: HomeComponent },
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
