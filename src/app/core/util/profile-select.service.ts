import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileSelectService implements OnDestroy {
  profileId$ = new ReplaySubject<string| null>(1);

  constructor() {
    const id =  localStorage.getItem('profileId');
    this.profileId$.next(id);
  }

  ngOnDestroy() {
    this.profileId$.complete();
  }

  select(id: string) {
    localStorage.setItem('profileId', id);
    this.profileId$.next(id);
  }

}
