import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '@app/core/model';
import { AuthService, GoodsCommentsService, GoodsService } from '@app/core/http';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-goods-comment-list',
  templateUrl: './goods-comment-list.component.html',
  styleUrls: ['./goods-comment-list.component.scss']
})
export class GoodsCommentListComponent implements OnInit {
  private userId: string;
  commentList$: Observable<Comment[]>;

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
  }

  ngOnInit(): void {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
    if (goodsId) {
      const goodsRef = this.goodsService.getDocRef(goodsId);
      this.commentList$ = this.commentsService.getAllByGoodsRef(goodsRef);
    }
  }

  canDelete(userId): boolean { return this.userId === userId; }

  onClickDelete(comment: Comment) {
    this.commentsService.delete(comment.id);
  }
}
