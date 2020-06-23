import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoodsComment, User } from '@app/core/model';
import { AuthService, GoodsCommentsService, GoodsService } from '@app/core/http';

@Component({
  selector: 'app-goods-comment-list',
  templateUrl: './goods-comment-list.component.html',
  styleUrls: ['./goods-comment-list.component.scss']
})
export class GoodsCommentListComponent implements OnInit {
  private userId: string;
  commentList$: Observable<GoodsComment[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private commentsService: GoodsCommentsService
  ) {
    this.authService.user$.pipe(
      filter(u => !!u),
      first()
    ).subscribe(u => this.userId = u.id);

    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
    this.commentList$ = this.commentsService.getAllByGoodsRef(goodsId).pipe(
      map(cList => {
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

  ngOnInit(): void {
  }

  canDelete(userId): boolean { return this.userId === userId; }

  onClickDelete(comment: GoodsComment) {
    if (confirm(comment.body + '를 삭제할까요?')) {
      this.commentsService.delete(comment.id);
    }
  }

}
