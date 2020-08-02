import { combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { ProfileExt } from '@app/core/model';
import { AuthService, GroupsService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { ProfileSelectService } from '@app/core/util';
import { HeaderService } from '@app/shared/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        transform: 'translateX(0)',
      })),
      state('closed', style({
        transform: 'translateX(-100%)',
      })),
      transition('open <=> closed', [
        animate('0.15s')
      ]),
    ]),
    trigger('fadeInOut', [
      state('fadeIn', style({
        display: 'block',
      })),
      state('fadeOut', style({
        display: 'none',
      })),
      transition('fadeIn => fadeOut', [
        animate('0.15s')
      ]),
      transition('fadeOut => fadeIn', [
        animate('0s')
      ]),
    ]),
  ]
})
export class HeaderComponent implements OnInit {
  activatedMenu = false;

  @Output() openMenu: EventEmitter<AnimationEvent> = new EventEmitter();
  @Output() closeMenu: EventEmitter<AnimationEvent> = new EventEmitter();

  profileExt$ = this.authService.profileExt$.pipe(shareReplay(1));
  title$ = combineLatest([
    this.profileExt$,
    this.headerService.title$
  ]).pipe(
    map(([profile, title]) => title ? { type: 'etc', body: title } : { type: 'group', body: profile.group.name })
  );

  writeGoodsCount$ = this.persistenceService.writtenGoods$.pipe(map(g => g.length));
  favoriteGoodsCount$ = this.persistenceService.favoritedGoods$.pipe(map(g => g.length));
  newMessageExts$ = this.persistenceService.messageExts$.pipe(
    map(messages => messages.filter(m => !m.read))
  );
  profileExts$ = this.authService.profileExts$;

  constructor(
    private router: Router,
    private authService: AuthService,
    private groupsService: GroupsService,
    private headerService: HeaderService,
    private persistenceService: PersistenceService,
    private profileSelectService: ProfileSelectService
  ) {
  }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.activatedMenu = !this.activatedMenu;
  }

  onClickSelectProfile(profileExt: ProfileExt) {
    this.onCloseMenu();
    this.profileSelectService.select(profileExt.id);
  }

  onAnimationStart(event: AnimationEvent) {
    if (event.toState === 'open') {
      this.openMenu.emit(event);
    } else {
      this.closeMenu.emit(event);
    }
  }

  onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'open') {
      this.openMenu.emit(event);
    } else {
      this.closeMenu.emit(event);
    }
  }

  onCloseMenu() {
    this.activatedMenu = false;
  }

}
