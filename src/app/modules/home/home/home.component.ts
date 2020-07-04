import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http/auth.service';
import { share } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  profile$ = this.authService.profile$.pipe(share());

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
  }

  onClickSignOut(e: Event) {
    e.preventDefault();
    this.authService.signOut();
  }

}
