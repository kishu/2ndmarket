import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/http/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.user$.pipe().subscribe(u => console.log('user', u));
    this.authService.group$.pipe().subscribe(g => console.log('group', g));
  }

  ngOnInit(): void {
  }

}
