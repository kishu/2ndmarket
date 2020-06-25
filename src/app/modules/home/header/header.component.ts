import { Observable, of } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http/auth.service';
import { GroupsService } from "@app/core/http";
import { Group, User } from '@app/core/model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<User>;
  group$: Observable<Group | null>;
  constructor(
    private authService: AuthService,
    private groupService: GroupsService
  ) {
    this.user$ = this.authService.user$;
    this.group$ = this.authService.profile$.pipe(
      switchMap(p => {
        if (p) {
          return this.groupService.get(p.groupId);
        } else {
          return of(null);
        }
      })
    );
  }

  ngOnInit(): void {
  }

}
