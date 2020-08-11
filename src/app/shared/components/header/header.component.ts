import { map, shareReplay } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // url;
  profileExt$ = this.authService.profileExt$;
  newMessagesCount$ = this.persistenceService.newMessageCount$;
  constructor(
    public router: Router,
    private authService: AuthService,
    private persistenceService: PersistenceService,
  ) {
    // this.url = router.url;
  }

  ngOnInit(): void {
  }

}
