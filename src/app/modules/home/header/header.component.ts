import { combineLatest, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GroupsService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { HeaderService } from "@app/shared/services";

@Component({
  selector: 'app-header, [app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profile$ = this.authService.profile$.pipe(filter(p => !!p));
  group$ = this.authService.profile$.pipe(
    switchMap(profile => {
      if (profile) {
        return this.groupsService.get(profile.groupId);
      } else {
        return of(null);
      }
    })
  );

  title$ = combineLatest([
    this.group$,
    this.headerService.title$
  ]).pipe(
    map(([group, title]) => title ? title : `세컨드마켓@${group.name}`)
  );

  newMessages$ = this.persistenceService.messageExts$.pipe(
    map(messages => messages.filter(m => !m.read))
  );

  constructor(
    private authService: AuthService,
    private groupsService: GroupsService,
    private persistenceService: PersistenceService,
    private headerService: HeaderService
  ) {
  }

  ngOnInit(): void {
  }

}
