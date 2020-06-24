import { random } from 'lodash-es';
import { difference } from 'lodash-es';
import { BehaviorSubject, empty, forkJoin, Observable, throwError, zip } from 'rxjs';
import { first, map, share, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService, GroupsService, UserGroupsService, UserService } from '@app/core/http';
import { AngularFireFunctions } from '@angular/fire/functions';
import { GroupRef, NewUser, NewUserAuth, NewUserGroup, UserGroup } from '@app/core/model';
import { firestore } from "firebase";
import { UserAuthService } from "@app/core/http/user-auth.service";
import { fromPromise } from "rxjs/internal-compatibility";


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
    private userService: UserService,
    private userGroupsService: UserGroupsService,
    private userAuthService: UserAuthService,
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
    console.log('code', code);
    const callable = this.fns.httpsCallable('sendVerificationEmail');
    callable({ to, code }).pipe(first()).subscribe(() => {
      // i don't know why this subscribe function run outside of ngzone.
      // this is just tricky code.
      this.ngZone.run(() => {
        this.code = code;
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

    // createNewUser
    const newUser: NewUser = {
      email: this.email,
      displayName: this.email.split('@')[0],
      photoURL: ''
    };

    const user$ = this.authService.user$.pipe(first());
    const addUser$ = this.userService.add(newUser);
    const getGroup$ = this.groupsService.getByDomain(this.email.split('@')[1]).pipe(first());

    const test$ = this.userService.getUserByEmail(this.email).pipe(first(), map(u => u.length > 0), share());

    addUser$.subscribe()



    this.userService.getUserByEmail(this.email).pipe(
      first(),
      switchMap(users => {
        const diff = difference([this.email], users.map(u => u.email));
        const add$ = diff.map(d => this.userService.add({ email: d, displayName: d.split('@')[0], photoURL: ''}));
        forkJoin(...add$)
      })
    ).subscribe();







    // const test$ = fromPromise(this.userService.add(newUser)).pipe(
    //   withLatestFrom(getGroup$),
    //   switchMap(([u, g]) => {
    //     console.log('111', u, g);
    //     return this.userGroupsService.getByUserIdAndGroupRef(u.id, g.id).pipe(
    //       first(),
    //       tap(r => console.log('222', r)),
    //       map(ugs => ugs.filter(ug => ug.id !== u.id && ug.groupRef.id !== g.id))
    //     );
    //   })
    // ).subscribe(r => console.log('rrr', r));




    //
    //
    // this.userService.add(newUser).pipe(
    //   switchMap(u => {
    //     this.groupsService.getByDomain(this.email.split('@')[1]).pipe(first())
    //   })
    //   tap(u => u.id)
    // )
    //
    // forkJoin([addUser$, getGroup$, user$]).pipe(
    //   switchMap(([addUser, group, user]) => {
    //     const newUserGroup: NewUserGroup = {
    //       userId: addUser.id,
    //       groupRef: this.groupsService.getDocRef(group.id),
    //       created: UserGroupsService.serverTimestamp()
    //     }
    //     const newUserAuth: NewUserAuth = {
    //       authId: user.id,
    //       userId: addUser.id,
    //       activated: true,
    //       created: UserAuthService.serverTimestamp()
    //     }
    //     return forkJoin([this.userGroupsService.add(newUserGroup),
    //       this.userAuthService.add(newUserAuth)]);
    //   })
    // ).subscribe(r => console.log('rrr', r));
    //
    //
    // return;


    // const createNewUserGroup = (uid, gid): NewUserGroup => {
    //   return {
    //     userId: uid,
    //     groupRef: this.groupsService.getDocRef(gid),
    //     created: UserGroupsService.serverTimestamp()
    //   };
    // };
    // const domain = this.domainCtl.value;
    // const userAndGroup$ = zip(this.authService.user$.pipe(first()), this.groupsService.getByDomain(domain).pipe(first()));
    // userAndGroup$
    //   .pipe(
    //     switchMap(([u, g]) => {
    //       return this.userGroupsService.getByUserIdAndGroupId(u.id, this.groupsService.getDocRef(g.id)).pipe(first());
    //     }),
    //     withLatestFrom(userAndGroup$),
    //     switchMap(([ug, [u, g]]) => {
    //       return ug === null ?
    //         this.userGroupsService.add(createNewUserGroup(u.id, g.id)) :
    //         throwError('exist group');
    //     })
    //   )
    //   .subscribe(
    //     r => alert('ok'),
    //     err => alert(err)
    //   );
  }

}
