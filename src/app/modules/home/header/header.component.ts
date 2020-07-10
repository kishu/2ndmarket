import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GroupsService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';

@Component({
  selector: 'app-header, [app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  group$ = this.authService.profile$.pipe(
    switchMap(profile => {
      if (profile) {
        return this.groupsService.get(profile.groupId);
      } else {
        return of(null);
      }
    })
  );

  newMessages$ = this.persistenceService.messageExts$.pipe(
    map(messages => messages.filter(m => !m.read))
  );

  constructor(
    private authService: AuthService,
    private groupsService: GroupsService,
    private persistenceService: PersistenceService
  ) {
  }

  ngOnInit(): void {
  }

}
