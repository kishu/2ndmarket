import random from 'lodash/random';
import { firestore } from 'firebase/app'
import { BehaviorSubject, Observable, of, throwError, zip } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService, GroupsService, UserGroupsService } from '@app/core/http';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NewUserGroup, UpdatedUserGroup } from "@app/core/model";

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
    this.code = code;
    console.log('code', code);
    this.submitting = false;
    this.step$.next(GroupAddStep.verify);
    // const callable = this.fns.httpsCallable('sendVerificationEmail');
    // callable({ to, code }).pipe(first()).subscribe(() => {
    //   // i don't know why this subscribe function run outside of ngzone.
    //   // this is just tricky code.
    //   this.ngZone.run(() => {
    //     this.code = code;
    //     console.log('code', code);
    //     this.submitting = false;
    //     this.step$.next(GroupAddStep.verify);
    //   });
    // });
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
      const userAndGroupAndUserGroup$ = this.authService.user$
        .pipe(
          first(),
          switchMap(u => {
            return zip(
              of(u),
              this.groupsService.getByDomain(this.domainCtl.value),
              this.userGroupsService.getByUserId(u.id)
            );
          }),
          tap(([, g,]) => {
            if (!g) {
              alert('no domain');
              throwError('domain error');
            }
          })
        );

      userAndGroupAndUserGroup$
        .pipe(
          filter(([, , ug]) => ug === null),
          switchMap(([u, g]) => {
            const newUserGroup: NewUserGroup = {
              userId: u.id,
              groupRefs: [this.groupsService.getDocRef(g.id)],
              created: UserGroupsService.serverTimestamp(),
              updated: UserGroupsService.serverTimestamp()
            };
            return this.userGroupsService.add(newUserGroup);
          })
        ).subscribe();

      userAndGroupAndUserGroup$
        .pipe(
          filter(([, , ug]) => ug !== null),
          switchMap(([, g, ug]) => {
            const updatedUserGroup: UpdatedUserGroup = {
              groupRefs: firestore.FieldValue.arrayUnion(this.groupsService.getDocRef(g.id)),
              updated: UserGroupsService.serverTimestamp()
            };
            return this.userGroupsService.update(ug.id, updatedUserGroup);
          })
        )
        .subscribe();
    } else {
      this.verifyForm.setErrors({ incorrect: true });
    }
  }

}
