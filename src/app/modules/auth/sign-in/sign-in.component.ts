import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ProfilesService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/business';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  redirect$ = new BehaviorSubject<boolean>(true);

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService
      .getRedirectResult()
      .then(c => {
        if (!c || !c?.user) {
          this.redirect$.next(false);
          return;
        }

        if (c.user && c.additionalUserInfo?.isNewUser) {
          this.router.navigate(['preference/groups']);
          return;
        }

        this.authService.profileExt$.pipe(
          first()
        ).subscribe(p => {
          p ?
            this.router.navigate(['']) :
            this.router.navigate(['preference/groups']);
        });
      });
  }

  onClickSignIn(e: Event, provider: string) {
    e.preventDefault();
    this.authService
      .signInWithRedirect(provider)
  }

}
