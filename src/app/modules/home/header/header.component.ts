import { Observable, of } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GroupsService } from '@app/core/http';
import { Group, Profile } from '@app/core/model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profile$: Observable<Profile>;
  group$: Observable<Group | null>;
  constructor(
    private authService: AuthService,
    private groupService: GroupsService
  ) {
    this.profile$ = this.authService.profile$.pipe(share());
    this.group$ = this.profile$.pipe(
      switchMap(p => {
        if (p) {
          return this.groupService.get(p.groupId);
        } else {
          return of(null);
        }
      })
    );

    // test
    this.authService.user$.subscribe(u => console.log('user$', u));
    this.authService.profile$.subscribe(p => console.log('profile$', p));
  }

  ngOnInit(): void {
  }

}
