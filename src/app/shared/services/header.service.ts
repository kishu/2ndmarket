import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  hidden$ = new Subject<boolean>();
  constructor() { }
}
