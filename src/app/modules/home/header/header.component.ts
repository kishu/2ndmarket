import { Observable } from 'rxjs';
import { filter, first, map, share, shareReplay, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, NoticesService } from '@app/core/http';
import { Group, Profile, Notice } from '@app/core/model';

@Component({
  selector: 'app-header, [app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profile$: Observable<Profile> = this.authService.profile$.pipe(shareReplay(1));
  group$: Observable<Group> = this.authService.group$.pipe(share());
  noticeList$: Observable<Notice[]> = this.profile$.pipe(
    switchMap(p => this.noticesService.valueChangesQueryByProfileId(p.id))
  );
  noticeCount$: Observable<number> = this.profile$.pipe(
    first(),
    filter(p => !!p),
    switchMap(p => this.noticesService.valueChangesQueryByProfileIdAndUnread(p.id)),
    map(list => list.length)
  );

  constructor(
    private authService: AuthService,
    private noticesService: NoticesService
  ) {
  }

  ngOnInit(): void {
  }

}
