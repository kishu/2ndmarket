import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/http/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user$ = this.authService.user$;

  constructor(
    private router: Router,
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
