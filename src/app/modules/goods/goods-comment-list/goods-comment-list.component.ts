import { Observable, forkJoin, of } from 'rxjs';
import { filter, first, map, tap, share, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoodsComment, User, Goods } from '@app/core/model';
import { AuthService, GoodsCommentsService, GoodsService } from '@app/core/http';

export interface GoodsCommentExtend extends GoodsComment {
  seller: boolean;
  permission: boolean;
}

@Component({
  selector: 'app-goods-comment-list',
  templateUrl: './goods-comment-list.component.html',
  styleUrls: ['./goods-comment-list.component.scss']
})
export class GoodsCommentListComponent implements OnInit, AfterViewInit {
  @Input() goods: Goods;
  commentList$: Observable<GoodsComment[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private commentsService: GoodsCommentsService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
    const profile$ = this.authService.profile$.pipe(first(), filter(p => !!p), share());
    const comments$ = this.commentsService.getAllByGoodsId(goodsId).pipe(first());

    this.commentList$ = forkJoin([profile$, of(this.goods), comments$]).pipe(
      map(([profile, goods, comments]) => comments.map(c => ({...c, seller: goods.profileId === c.profileId, permission: c.profileId === profile.id}))),
      map((cList: GoodsCommentExtend[]) => {
        return cList.reduce((a, c) => {
          if (a.length === 0) {
            return [[c]];
          }
          const p = a[a.length - 1];
          if (p[0].userId === c.userId) {
            p.push(c);
          } else {
            a.push([c]);
          }
          return a;
        }, []);
      })
    );
  }

  onClickDelete(comment: GoodsComment) {
    if (confirm(comment.body + '를 삭제할까요?')) {
      this.commentsService.delete(comment.id);
    }
  }

}
