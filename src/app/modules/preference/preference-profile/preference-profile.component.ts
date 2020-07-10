import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Profile } from '@app/core/model';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/http';

@Component({
  selector: 'app-preference-profile, [app-preference-profile]',
  templateUrl: './preference-profile.component.html',
  styleUrls: ['./preference-profile.component.scss']
})
export class PreferenceProfileComponent implements OnInit {
  profileForm = this.fb.group({
    displayName: [],
  });
  profile$ = this.authService.profile$.pipe(
    first(),
    filter(p => !!p),
    tap(profile => this.displayNameCtl.setValue(profile.displayName))
  );

  get displayNameCtl() { return this.profileForm.get('displayName'); }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
  }

  onClickSignOut(e: Event) {
    e.preventDefault();
    this.authService.signOut();
    this.router.navigate(['/sign-in']);
  }
}
