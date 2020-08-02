import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  title$ = new BehaviorSubject<string | null>(null);
  constructor() { }
}
