import { Observable, of } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GroupsService } from '@app/core/http';
import { HeaderService } from '@app/shared/services';
import { Group, Profile } from '@app/core/model';

@Component({
  selector: 'app-header, [app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profile$: Observable<Profile> = this.authService.profile$.pipe(share());
  group$: Observable<Group | null> = this.profile$.pipe(
    switchMap(p => {
      if (p) {
        return this.groupService.get(p.groupId);
      } else {
        return of(null);
      }
    })
  );

  constructor(
    private authService: AuthService,
    private groupService: GroupsService,
  ) {
    // test
    this.authService.user2$.subscribe(u => console.log('user$', u));
    this.authService.profile2$.subscribe(p => console.log('profile$', p));
  }

  ngOnInit(): void {
  }

}
