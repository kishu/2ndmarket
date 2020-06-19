import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http/auth.service';
import { Group, User } from '@app/core/model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<User>;
  group$: Observable<Group>;
  constructor(
    private authService: AuthService
  ) {
    this.user$ = this.authService.user$;
    this.group$ = this.authService.group$;
  }

  ngOnInit(): void {
  }

}
