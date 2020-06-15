import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthService, SignInEmailService } from '@app/core/http';
import {first, switchMap, tap} from "rxjs/operators";
import { BehaviorSubject, from, throwError } from "rxjs";

enum SignInResultStep {
  verification = 'verification',
  verified = 'verified',
  failed = 'failed'
}

@Component({
  selector: 'app-sign-in-result',
  templateUrl: './sign-in-result.component.html',
  styleUrls: ['./sign-in-result.component.scss']
})
export class SignInResultComponent implements OnInit {
  step$ = new BehaviorSubject<SignInResultStep>(SignInResultStep.verification);

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private signInEmailService: SignInEmailService
  ) {
    const ref = this.route.snapshot.queryParamMap.get('ref'); // signInEmailId
    this.signInEmailService.update(ref, { verified: true }).then(
      () => this.step$.next(SignInResultStep.verified),
      () => this.step$.next(SignInResultStep.failed)
    );


    // this.signInEmailService
    //   .get(ref)
    //   .pipe(
    //     first(),
    //     tap(s => s || throwError('')),
    //     switchMap(s => this.authService.signInWithEmailLink(s.email))
    //   )
    //   .subscribe(
    //     r => {
    //       if (r && r?.additionalUserInfo && r.additionalUserInfo.isNewUser) {
    //         this.verified = true;
    //       } else if (r && r.user) {
    //         this.verified = true;
    //       }
    //     },
    //     err => alert(err)
    //   );
  }

  ngOnInit(): void {
  }

}
