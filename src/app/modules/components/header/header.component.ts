import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { AuthService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  routePath: string;
  profileExt$ = this.authService.profileExt$;
  newMessagesCount$ = this.persistenceService.newMessageCount$;

  constructor(
    private router: Router,
    private authService: AuthService,
    private persistenceService: PersistenceService,
  ) {
    this.router.events.pipe(
      filter(e => e instanceof ActivationEnd)
    ).subscribe((e: ActivationEnd) => {
      this.routePath = e.snapshot.routeConfig.path;
    });
  }

  ngOnInit(): void {
  }

}
