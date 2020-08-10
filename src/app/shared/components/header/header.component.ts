import { map, shareReplay } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profileExt$ = this.authService.profileExt$;
  newMessagesCount$ = this.persistenceService.newMessageCount$;
  constructor(
    private authService: AuthService,
    private persistenceService: PersistenceService,
  ) {
  }

  ngOnInit(): void {
  }

}
