import { BehaviorSubject, of } from 'rxjs';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, NoticesService } from '@app/core/http';
import { Notice } from '@app/core/model';

@Component({
  selector: 'app-preference-messages, [app-preference-messages]',
  templateUrl: './preference-messages.component.html',
  styleUrls: ['./preference-messages.component.scss']
})
export class PreferenceMessagesComponent implements OnInit {
  profile$ = this.authService.profile$.pipe(first(), filter(p => !!p), shareReplay());
  noticeList$ = this.profile$.pipe(
    switchMap(p => this.noticesService.valueChangesQueryByProfileId(p.id))
  );

  constructor(
    private authService: AuthService,
    private noticesService: NoticesService,
  ) {
  }

  ngOnInit(): void {
  }

  trackById(index, item) {
    return item.id;
  }

  onClickNotice(e: Event, notice: Notice) {
    e.preventDefault();
    this.noticesService.updateRead(notice.id);
  }

  onClickDeleteNotice(target: Notice) {
    this.noticesService.delete(target.id);
    this.noticeList$.pipe(
      map(nl => nl.filter(n => n.id !== target.id))
    ).subscribe(nl => this.noticeList$ = of(nl));
  }
}
