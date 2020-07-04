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
  profile$: Observable<Profile> = this.authService.profile$.pipe(share());
  group$: Observable<Group > = this.authService.group$.pipe(share());

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

}
