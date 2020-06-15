import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in4',
  templateUrl: './sign-in4.component.html',
  styleUrls: ['./sign-in4.component.scss']
})
export class SignIn4Component implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService
      .getRedirectResult()
      .then(c => {
        if (c && c.additionalUserInfo?.isNewUser) {
          this.router.navigate(['group/add']);
        }
      })
      .catch(err => alert(err));
  }

  onClickSignIn(e, provider: string) {
    e.preventDefault();
    this.authService
      .signInWithRedirect(provider)
      .catch(err => console.log(err));
  }

}
