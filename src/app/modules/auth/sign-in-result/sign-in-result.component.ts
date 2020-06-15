import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthService, SignInEmailService } from '@app/core/http';
import {first, switchMap, tap} from "rxjs/operators";
import {from, throwError} from "rxjs";

@Component({
  selector: 'app-sign-in-result',
  templateUrl: './sign-in-result.component.html',
  styleUrls: ['./sign-in-result.component.scss']
})
export class SignInResultComponent implements OnInit {
  failed = false;
  verified = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private signInEmailService: SignInEmailService
  ) {
    const ref = this.route.snapshot.queryParamMap.get('ref'); // signInEmailId
    this.signInEmailService
      .get(ref)
      .pipe(
        first(),
        tap(s => s || throwError('')),
        switchMap(s => this.authService.signInWithEmailLink(s.email))
      )
      .subscribe(
        r => {
          if (r && r?.additionalUserInfo && r.additionalUserInfo.isNewUser) {
            this.verified = true;
          } else if (r && r.user) {
            this.verified = true;
          }
        },
        err => alert(err)
      );
  }

  ngOnInit(): void {
  }

}
