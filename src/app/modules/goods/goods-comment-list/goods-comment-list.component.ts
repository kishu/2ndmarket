import { Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
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

    this.commentList$ = this.authService.profileExt$.pipe(
      first(),
      filter(p => !!p),
      switchMap(profile => {
        return this.commentsService.valueChangesQueryByGoodsId(goodsId).pipe(
          map(comments => {
            return comments.map(c => {
              return {
                ...c,
                seller: this.goods.profileId === c.profileId,
                permission: c.profileId === profile.id
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
      })
    );
  }

  onClickDelete(comment: GoodsComment) {
    if (confirm(comment.body + '를 삭제할까요?')) {
      this.commentsService.delete(comment.id);
    }
  }

  trackById(index, item) {
    return item.id;
  }

}
