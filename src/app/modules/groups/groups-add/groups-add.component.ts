import random from 'lodash/random';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupService } from '@app/core/http';
import { AngularFireFunctions } from '@angular/fire/functions';

enum GroupAddStep {
  email = 'email',
  verify = 'verify'
}

@Component({
  selector: 'app-groups-add',
  templateUrl: './groups-add.component.html',
  styleUrls: ['./groups-add.component.scss']
})
export class GroupsAddComponent implements OnInit {
  code: number;
  step$ = new BehaviorSubject<GroupAddStep>(GroupAddStep.email);
  submitting = false;
  domains$: Observable<string[]>;
  emailForm: FormGroup;
  verifyForm: FormGroup;

  get accountCtl() { return this.emailForm.get('account'); }
  get domainCtl() { return this.emailForm.get('domain'); }
  get codeCtl() { return this.verifyForm.get('code'); }

  constructor(
    private ngZone: NgZone,
    private fb: FormBuilder,
    private groupService: GroupService,
    private fns: AngularFireFunctions
  ) {
    this.domains$ = this.groupService
    .getAll([['created', 'desc']])
    .pipe(
      first(),
      map(groups => groups.reduce((acc, group) => acc.concat(group.domains), []).sort())
    );
  }

  ngOnInit(): void {
    this.step$.subscribe(step => {
      if (step === GroupAddStep.email) {
        this.emailForm = this.fb.group({
          account: ['kishu'],
          domain: [''],
        });
      } else {
        this.verifyForm = this.fb.group({
          code: ['']
        });
      }
    })
  }

  onEmailSubmit() {
    this.submitting = true;
    const to = `${this.accountCtl.value.trim()}@${this.domainCtl.value}`;
    const code = random(1000, 9999);
    const callable = this.fns.httpsCallable('sendVerificationEmail');
    callable({ to, code }).pipe(first()).subscribe(() => {
      // i don't know why this subscribe function run outside of ngzone.
      // this is just tricky code.
      this.ngZone.run(() => {
        this.code = code;
        console.log('code', code);
        this.submitting = false;
        this.step$.next(GroupAddStep.verify);
      });
    });
  }

  onTimeoverLimitTimer() {
    this.verifyForm.setErrors({ timeover: true });
    this.codeCtl.disable();
  }

  onClickRetry() {
    this.step$.next(GroupAddStep.email);
  }

  onVerifySubmit() {
    if (this.code === parseInt(this.codeCtl.value, 10)) {
      alert('ok');
    } else {
      this.verifyForm.setErrors({ incorrect: true });
    }
  }

}
