import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoverService {
  cover$ = new Subject<{ show: boolean, message: string }>();

  constructor() { }

  show(message: string) {
    this.cover$.next({ show: true, message });
  }

  hide() {
    this.cover$.next( { show: false, message: '' } );
  }
}
