import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService
      .getRedirectResult()
      .then(c => {
        console.log(c);
        if (c && c.additionalUserInfo?.isNewUser) {
          this.router.navigate(['group/add']);
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

  onClickSignOut(e: Event) {
    e.preventDefault();
    this.authService.signOut().then(() => alert('ok'));
  }

}
