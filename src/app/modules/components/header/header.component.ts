import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Group } from '@app/core/model';
import { AuthService } from '@app/core/http';
import { Persistence2Service, PersistenceService } from '@app/core/persistence';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  routePath: string;
  group = this.authService.account.profile.group;
  newMessagesCount$ = this.persistence2Service.newMessageCount$;

  constructor(
    private router: Router,
    private authService: AuthService,
    private persistence2Service: Persistence2Service,
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
