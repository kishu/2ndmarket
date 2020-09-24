import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserInfosService } from '@app/core/http';
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
    private authService: AuthService,
    private profileSelectService: ProfileSelectService,
    private userInfosService: UserInfosService
  ) { }

  ngOnInit(): void {
    this.authService
      .getRedirectResult()
      .then(c => {
        if (!c || !c?.user) {
          this.redirect$.next(false);
          return;
        }

        console.log('c', c);

        if (c.user && c.additionalUserInfo?.isNewUser) {
          this.router.navigate(['preference/groups']);
          return;
        }

        this.userInfosService.get(c.user.uid).subscribe(userInfo => {
          if (userInfo.profileId) {
            this.profileSelectService.select(userInfo.profileId).subscribe(() => {
              this.router.navigate(['/goods']);
            });
          } else {
            this.router.navigate(['preference/groups']);
          }
        });
      });
  }

  onClickSignIn(e: Event, provider: string) {
    e.preventDefault();
    this.authService.signInWithRedirect(provider);
  }

}
