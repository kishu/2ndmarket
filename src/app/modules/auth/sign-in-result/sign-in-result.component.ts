import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http/auth.service';

@Component({
  selector: 'app-sign-in-result',
  templateUrl: './sign-in-result.component.html',
  styleUrls: ['./sign-in-result.component.scss']
})
export class SignInResultComponent implements OnInit {
  failed = false;
  verified = false;
  constructor(
    private authService: AuthService
  ) {
    this.authService.signInWithEmailLink()
      .then(r => {
        if (r && r?.additionalUserInfo && r.additionalUserInfo.isNewUser) {
          this.verified = true;
        } else if (r && r.user) {
          this.verified = true;
        }
      })
      .catch(() => this.failed = true);
  }

  ngOnInit(): void {
  }

}
