import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.route.url.subscribe(u => console.log('url', u));
    this.user$ = this.authService.user$;
    this.group$ = this.authService.group$;
  }

  ngOnInit(): void {
  }

}
