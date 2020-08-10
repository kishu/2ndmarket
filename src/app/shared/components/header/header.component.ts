import { combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { HeaderService } from '@app/shared/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profileExt$ = this.authService.profileExt$;
  title$ = combineLatest([
    this.profileExt$,
    this.headerService.title$
  ]).pipe(
    map(([profile, title]) => title ? { type: 'etc', body: title } : { type: 'group', body: profile.group.name })
  );
  newMessages$ = this.persistenceService.messageExts$.pipe(
    map(messages => messages.filter(m => !m.read)),
    map(messages => messages.length),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  profileExts$ = this.authService.profileExts$;

  constructor(
    private authService: AuthService,
    private headerService: HeaderService,
    private persistenceService: PersistenceService,
  ) {
  }

  ngOnInit(): void {
  }

}
