import { forkJoin, Observable } from "rxjs";
import { first, filter, switchMap } from "rxjs/operators";
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ProfilesService, UserProfilesService } from '@app/core/http';
import { Profile } from '@app/core/model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user$ = this.authService.user$;
  profiles$: Observable<Profile[]> = this.authService.user$.pipe(
    first(),
    filter(u => !!u),
    switchMap(u => this.userProfilesService.getAllByUserId(u.id)),
    switchMap(userProfiles => {
      return forkJoin(...userProfiles.map(userProfile => this.profilesService.get(userProfile.profileId).pipe(first())));
    })
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    private profilesService: ProfilesService,
    private userProfilesService: UserProfilesService
  ) {
  }

  ngOnInit(): void {
  }

  onClickSignOut(e: Event) {
    e.preventDefault();
    this.authService.signOut();
  }

}
