import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

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
        if (c?.user) {
          c.additionalUserInfo?.isNewUser ?
            this.router.navigate(['preference/groups']) :
            this.router.navigate(['']);
        } else {
          this.redirect$.next(false);
        }
      })
      .catch(err => alert(err));
  }

  onClickSignIn(e: Event, provider: string) {
    e.preventDefault();
    this.authService
      .signInWithRedirect(provider)
      .catch(err => alert(err));
  }

}
