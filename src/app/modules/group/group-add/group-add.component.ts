import random from 'lodash/random';
import { BehaviorSubject, Observable, throwError, zip } from 'rxjs';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService, GroupsService, UserGroupsService } from '@app/core/http';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NewUserGroup } from '@app/core/model';

enum GroupAddStep {
  email = 'email',
  verify = 'verify'
}

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {
  code: number;
  step$ = new BehaviorSubject<GroupAddStep>(GroupAddStep.email);
  submitting = false;
  domains$: Observable<string[]>;
  emailForm: FormGroup;
  verifyForm: FormGroup;

  get accountCtl() { return this.emailForm.get('account'); }
  get domainCtl() { return this.emailForm.get('domain'); }
  get email() { return `${this.accountCtl.value.trim()}@${this.domainCtl.value}`; }
  get codeCtl() { return this.verifyForm.get('code'); }

  constructor(
    private ngZone: NgZone,
    private fb: FormBuilder,
    private fns: AngularFireFunctions,
    private authService: AuthService,
    private userGroupsService: UserGroupsService,
    private groupsService: GroupsService
  ) {
    this.domains$ = this.groupsService
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
          account: [''],
          domain: [''],
        });
      } else {
        this.verifyForm = this.fb.group({
          email: [this.email],
          code: ['']
        });
      }
    });
  }

  onEmailSubmit() {
    this.submitting = true;
    const to = this.email;
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
    if (this.code !== parseInt(this.codeCtl.value, 10)) {
      return this.verifyForm.setErrors({ incorrect: true });
    }
    const createNewUserGroup = (uid, gid): NewUserGroup => {
      return {
        userId: uid,
        groupRef: this.groupsService.getDocRef(gid),
        activated: true,
        created: UserGroupsService.serverTimestamp(),
        updated: UserGroupsService.serverTimestamp()
      };
    };
    const domain = this.domainCtl.value;
    const userAndGroup$ = zip(this.authService.user$.pipe(first()), this.groupsService.getByDomain(domain).pipe(first()));
    userAndGroup$
      .pipe(
        switchMap(([u, g]) => {
          return this.userGroupsService.getByUserIdAndGroupId(u.id, this.groupsService.getDocRef(g.id)).pipe(first());
        }),
        withLatestFrom(userAndGroup$),
        switchMap(([ug, [u, g]]) => {
          return ug === null ?
            this.userGroupsService.add(createNewUserGroup(u.id, g.id)) :
            throwError('exist group');
        })
      )
      .subscribe(
        r => alert('ok'),
        err => alert(err)
      );
  }

}
