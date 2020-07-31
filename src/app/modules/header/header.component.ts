import { combineLatest, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService, GroupsService } from '@app/core/http';
import { Router } from '@angular/router';
import { PersistenceService } from '@app/core/persistence';
import { ProfileSelectService } from '@app/core/util';
import { HeaderService } from '@app/shared/services';
import { ProfileExt } from '@app/core/model';

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
  isMenuActivated = false;
  @Output() openMenu: EventEmitter<AnimationEvent> = new EventEmitter();
  @Output() closeMenu: EventEmitter<AnimationEvent> = new EventEmitter();

  profile$ = this.authService.profileExt$.pipe(filter(p => !!p));
  group$ = this.authService.profileExt$.pipe(
    switchMap(profile => {
      if (profile) {
        return this.groupsService.get(profile.groupId);
      } else {
        return of(null);
      }
    })
  );

  title$ = combineLatest([
    this.group$,
    this.headerService.title$
  ]).pipe(
    map(([group, title]) => title ? title : `세컨드마켓@${group.name}`)
  );

  newMessages$ = this.persistenceService.messageExts$.pipe(
    map(messages => messages.filter(m => !m.read))
  );

  writeGoodsCount$ = this.persistenceService.writeGoods$.pipe(map(g => g.length));
  favoriteGoodsCount$ = this.persistenceService.favoriteGoods$.pipe(map(g => g.length));
  profileExts$ = this.persistenceService.profileExts$;
  selectedProfileId$ = this.profileSelectService.profileId$.pipe();

  constructor(
    private router: Router,
    private authService: AuthService,
    private groupsService: GroupsService,
    private persistenceService: PersistenceService,
    private profileSelectService: ProfileSelectService,
    private headerService: HeaderService
  ) {
    this.persistenceService.profileExts$.pipe(first()).subscribe(p => console.log('p', p));
  }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.isMenuActivated = !this.isMenuActivated;
  }

  onClickSelectProfile(profileExt: ProfileExt) {
    this.profileSelectService.select(profileExt.id);
    this.onCloseMenu();
    // this.router.navigate(['/']);

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
    this.isMenuActivated = false;
  }

}
