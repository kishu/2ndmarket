import { countBy } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { first, map, takeUntil, tap } from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoodsComment, Goods } from '@app/core/model';
import { AuthService, GoodsCommentsService, GoodsService } from '@app/core/http';

export interface GoodsCommentExtend extends GoodsComment {
  seller: boolean;
  permission: boolean;
}

@Component({
  selector: 'app-goods-comment-list, [app-goods-comment-list]',
  templateUrl: './goods-comment-list.component.html',
  styleUrls: ['./goods-comment-list.component.scss']
})
export class GoodsCommentListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() goods: Goods;
  protected destroy$ = new Subject();
  commentList$: Observable<GoodsComment[]>;
  commentUserCount: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private commentsService: GoodsCommentsService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  ngAfterViewInit() {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
    const profileId = this.authService.profile.id;

    this.commentList$ = this.commentsService.valueChangesQueryByGoodsId(goodsId).pipe(
      takeUntil(this.destroy$),
      tap(comments => {
        this.commentUserCount = Object.keys(
          countBy(comments, 'profileId')
        ).length;
      }),
      map(comments => {
        return comments.map(c => {
          return {
            ...c,
            seller: this.goods.profileId === c.profileId,
            permission: c.profileId === profileId
          } as GoodsCommentExtend;
        });
      }),
      map(comments => {
        return comments.reduce((a, c) => {
          if (a.length === 0) {
            return [[c]];
          }
          const p = a[a.length - 1];
          if (p[0].profileId === c.profileId) {
            p.push(c);
          } else {
            a.push([c]);
          }
          return a;
        }, []);
      })
    );
  }

  onDelete(comment: GoodsComment) {
    this.authService.profileExt$.pipe(
      first()
    ).subscribe(p => {
      if (p.id === comment.profileId && confirm(comment.body + '를 삭제할까요?')) {
        this.commentsService.delete(comment.id);
      }
    });
  }

  trackById(index, item) {
    return item.id;
  }

}
