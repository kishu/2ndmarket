import { forkJoin } from 'rxjs';
import { first, filter, map, switchMap } from 'rxjs/operators';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService, GoodsCommentsService, GoodsService } from '@app/core/http';
import { NewGoodsComment } from '@app/core/model';

@Component({
  selector: 'app-goods-comment-form, [app-goods-comment-form]',
  templateUrl: './goods-comment-form.component.html',
  styleUrls: ['./goods-comment-form.component.scss']
})
export class GoodsCommentFormComponent implements OnInit {
  @Input() goodsId: string;
  @ViewChild('bodyRef', { static: true }) bodyRef: ElementRef;
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
    this.bodyRef.nativeElement.focus();

    forkJoin([
      this.authService.user$.pipe(first(), filter(u => !!u)),
      this.authService.profileExt$.pipe(first(), filter(p => !!p))
    ]).pipe(
      map(([u, p]) => ({
        userId: u.id,
        profileId: p.id,
        goodsId: this.goodsId,
        ...this.commentForm.value,
        created: GoodsCommentsService.serverTimestamp()
      } as NewGoodsComment)),
      switchMap(c => {
        this.commentForm.reset();
        return this.goodsCommentsService.add(c);
      })
    ).subscribe(
      () => this.submitting = false,
      (err) => alert(err)
    );
  }

}
