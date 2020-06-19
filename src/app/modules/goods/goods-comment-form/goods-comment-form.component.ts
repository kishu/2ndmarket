import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService, GoodsCommentsService, GoodsService } from '@app/core/http';
import { NewComment } from '@app/core/model';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-goods-comment-form',
  templateUrl: './goods-comment-form.component.html',
  styleUrls: ['./goods-comment-form.component.scss']
})
export class GoodsCommentFormComponent implements OnInit {
  @Input() goodsId: string;
  submitting = false;
  commentForm = this.fb.group({
    body: ['']
  });

  get bodyCtl() { return this.commentForm.get('body'); }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCommentsService: GoodsCommentsService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitting = true;
    this.authService.user$
      .pipe(
        map(u => ({
          userId: u.id,
          goodsRef: this.goodsService.getDocRef(this.goodsId),
          ...this.commentForm.value,
          created: GoodsCommentsService.serverTimestamp()
        } as NewComment)),
        switchMap(c => this.goodsCommentsService.add(c))
      )
      .subscribe(
        () => {
          this.commentForm.reset();
          this.submitting = false;
        },
        (err) => alert(err)
      );
  }

}
