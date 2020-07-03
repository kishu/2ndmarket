import { Observable, of } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GroupsService } from '@app/core/http';
import { Group, Profile } from '@app/core/model';

@Component({
  selector: 'app-header, [app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profile$: Observable<Profile> = this.authService.profile$;
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
  }

  ngOnInit(): void {
  }

}
