import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectProfileService implements OnDestroy {
  private observer;
  profileId$: Observable<string | null>;

  constructor() {
    this.profileId$ = Observable.create(observer =>  {
      const id =  localStorage.getItem('profileId');
      this.observer = observer;
      this.observer.next(id);
    });
  }

  ngOnDestroy() {
    this.observer.complete();
  }

  select(id: string) {
    localStorage.setItem('profileId', id);
    console.log('selecte2', localStorage.getItem('profileId'));
    this.observer.next(id);
  }

}
